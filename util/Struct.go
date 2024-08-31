package mystruct

type User struct {
	EmpID     int64
	FirstName string
	LastName  string
	Email     string
	State     string
	District  string
	Role      string
	Language  string
	KYC       bool
}

type MyPrompt struct {
	Prompt   string   `json:"prompt"`
	Response []string `json:"response"`
}
