package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
)

func GetOrders(c echo.Context) error {
	data, err := os.ReadFile("orders.json")
	if err != nil {
		return c.JSON(http.StatusOK, []interface{}{})
	}

	var orders []interface{}
	if err := json.Unmarshal(data, &orders); err != nil {
		return c.JSON(http.StatusOK, []interface{}{})
	}

	return c.JSON(http.StatusOK, orders)
}

func CreateOrder(c echo.Context) error {
	var newOrder map[string]interface{}
	if err := c.Bind(&newOrder); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Неверный формат заказа"})
	}

	newOrder["id"] = time.Now().Unix()
	newOrder["date"] = time.Now().Format("02.01.2006")

	data, _ := os.ReadFile("orders.json")
	var orders []map[string]interface{}
	if len(data) > 0 {
		json.Unmarshal(data, &orders)
	}

	orders = append(orders, newOrder)

	go func() {
		updatedData, _ := json.MarshalIndent(orders, "", "  ")
		os.WriteFile("orders.json", updatedData, 0644)
	}()

	return c.JSON(http.StatusCreated, newOrder)
}
