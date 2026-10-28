package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Неверный формат запроса"})
	}

	if req.Username == "user" && req.Password == "password" {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"token":    "fake-jwt-token-123",
			"username": req.Username,
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"error": "такого пользователя нет, возможно неправильный логин или пароль - проверьте данные",
	})
}

func Logout(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Успешный выход"})
}
