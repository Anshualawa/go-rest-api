package main

// AIzaSyCXiA8lbT_9bYhUwjRCi_bADZ0j0Djdjwg
import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/google/generative-ai-go/genai"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/api/option"
)

type MyPrompt struct {
	Prompt   string   `json:"prompt"`
	Response []string `json:"response"`
}

func main() {

	e := echo.New()

	// Middleware to log requests and recover from panics
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Configure CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173"},                                                                // Allow your frontend origin
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions}, // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},                                    // Allowed headers
		AllowCredentials: true,                                                                                             // Allow credentials like cookies
	}))

	// Basic welcome route

	// AI Chat Route
	e.POST("/ai-chat", func(c echo.Context) error {
		var prt MyPrompt
		if err := c.Bind(&prt); err != nil {
			log.Println("Error binding JSON:", err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid Prompt"})
		}

		// AI Gemini connection
		ctx := context.Background()
		apiKey := os.Getenv("alawa") // Ensure this environment variable is set
		if apiKey == "" {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "API key not set"})
		}

		client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
		if err != nil {
			log.Fatal(err)
		}
		defer client.Close()

		model := client.GenerativeModel("gemini-1.5-flash")
		model.GenerationConfig = genai.GenerationConfig{
			ResponseMIMEType: "application/json",
		}
		resp, err := model.GenerateContent(ctx, genai.Text(prt.Prompt))
		if err != nil {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, map[string]interface{}{"AIResponse": resp.Candidates})
	})

	// Start server on port 8080
	e.Logger.Fatal(e.Start(":8080"))
}
