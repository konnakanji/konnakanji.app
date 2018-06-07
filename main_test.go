package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/aerogo/aero"
	"github.com/stretchr/testify/assert"
)

func TestApp(t *testing.T) {
	app := configure(aero.New())

	request, _ := http.NewRequest("GET", "/", nil)
	request.Header.Set("Accept-Encoding", "gzip")

	response := httptest.NewRecorder()
	app.Handler().ServeHTTP(response, request)

	assert.Equal(t, http.StatusOK, response.Code)
}
