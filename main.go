package main

import (
	"strings"

	"github.com/aerogo/aero"
	"github.com/konnakanji/konnakanji/assets"
	"github.com/konnakanji/konnakanji/components"
)

var mainApp = aero.New()

func main() {
	configure(mainApp).Run()
}

func configure(app *aero.Application) *aero.Application {
	configureHTTPS(app)
	assets.Load()

	appCode := func(ctx *aero.Context) string {
		return ctx.HTML(components.Layout(ctx))
	}

	app.Get("/", appCode)
	app.Get("/test/*name", appCode)

	app.Get("/scripts", func(ctx *aero.Context) string {
		return ctx.JavaScript(assets.JS)
	})

	app.Get("/styles", func(ctx *aero.Context) string {
		return ctx.CSS(assets.CSS)
	})

	app.Get("/manifest.json", func(ctx *aero.Context) string {
		return ctx.JSON(assets.Manifest)
	})

	app.Get("/words/*file", func(ctx *aero.Context) string {
		return ctx.File("words/" + ctx.Get("file"))
	})

	app.Get("/images/*file", func(ctx *aero.Context) string {
		return ctx.File("images/" + ctx.Get("file"))
	})

	app.Get("/service-worker", func(ctx *aero.Context) string {
		return ctx.File("scripts/ServiceWorker/ServiceWorker.js")
	})

	// Send "Link" header for Cloudflare on HTML responses
	app.Use(func(ctx *aero.Context, next func()) {
		if !strings.HasPrefix(ctx.URI(), "/_/") && strings.Contains(ctx.Request().Header().Get("Accept"), "text/html") {
			ctx.Response().Header().Set("Link", "</styles>; rel=preload; as=style,</scripts>; rel=preload; as=script")
		}

		next()
	})

	return app
}
