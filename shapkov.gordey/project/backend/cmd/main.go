package main

import (
	"log"

	"github.com/TheEmfield/web-project/backend/internal/handlers"
	"github.com/TheEmfield/web-project/backend/internal/middleware"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORS())

	e.POST("/login", handlers.Login)
	e.POST("/logout", handlers.Logout)
	e.GET("/goods", handlers.GetGoods)
	e.GET("/orders", handlers.GetOrders)
	e.POST("/orders", handlers.CreateOrder)

	log.Println("Backend:8080")
	if err := e.Start(":8080"); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
