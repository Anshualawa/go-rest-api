package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	mystruct "github.com/Anshualawa/go-rest-api/util"
	"github.com/gin-gonic/gin"
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
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Welcome to the Go REST API: Fast, Simple, and Built to Scale—Your Data’s New Best Friend!")
	})

	// CMS Start
	user := []mystruct.User{} // Store Data from POST Method
	var empid int64 = 20243100
	cu := new(mystruct.User)

	e.GET("/cms-user", func(c echo.Context) error {
		return c.JSON(http.StatusOK, user)
	})

	e.POST("/cms-user", func(c echo.Context) error {
		if err := c.Bind(cu); err != nil {
			return err
		}
		empid++
		for _, vfy := range user {
			if vfy.Email == cu.Email {
				return c.JSON(http.StatusBadRequest, map[string]string{"error": "Email ID already exists"})
			}
			if vfy.EmpID == empid {
				return c.JSON(http.StatusBadRequest, map[string]string{"error": "Employee Already Exists"})
			}
		}
		user = append(user, mystruct.User{
			EmpID:     empid,
			FirstName: cu.FirstName,
			LastName:  cu.LastName,
			Email:     cu.Email,
			State:     cu.State,
			District:  cu.District,
			Role:      cu.Role,
			Language:  cu.Language,
			KYC:       cu.KYC,
		})

		return c.JSON(http.StatusOK, user[len(user)-1])
	})
	// CMS End

	// AI Chat Route
	e.POST("/ai-chat", func(c echo.Context) error {
		var prt MyPrompt
		err := c.Bind(&prt)
		if err != nil {
			fmt.Println("Error binding JSON:", err)
			return c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Prompt"})
		}

		// AI Gemini connection
		ctx := context.Background()
		client, err := genai.NewClient(ctx, option.WithAPIKey("AIzaSyCXiA8lbT_9bYhUwjRCi_bADZ0j0Djdjwg"))
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
			return c.JSON(http.StatusNotFound, gin.H{"Gemini Error": err.Error()})
		}

		data := aiResponse(resp)

		return c.JSON(http.StatusOK, gin.H{"Gemini response": data})
	})

	// Start server on port 8080
	e.Logger.Fatal(e.Start(":8080"))
}

func aiResponse[T any](prmtResp T) T {
	var response T = prmtResp
	return response
}
