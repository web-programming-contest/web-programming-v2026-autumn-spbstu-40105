package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func GetGoods(c echo.Context) error {
	data, err := os.ReadFile("goods.json")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Ошибка чтения товаров"})
	}

	var goods []interface{}
	if err := json.Unmarshal(data, &goods); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Ошибка парсинга товаров"})
	}

	return c.JSON(http.StatusOK, goods)
}
