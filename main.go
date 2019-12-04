package main

import (
	"strings"

	"github.com/aerogo/aero"
	"github.com/konnakanji/konnakanji/assets"
	"github.com/konnakanji/konnakanji/components"
)

func main() {
	app := aero.New()
	configure(app).Run()
}

func configure(app *aero.Application) *aero.Application {
	configureHTTPS(app)
	assets.Load()

	appCode := func(ctx aero.Context) error {
		return ctx.HTML(components.Layout(ctx))
	}

	app.Get("/", appCode)
	app.Get("/test/*name", appCode)

	app.Get("/scripts", func(ctx aero.Context) error {
		return ctx.JavaScript(assets.JS)
	})

	app.Get("/styles", func(ctx aero.Context) error {
		return ctx.CSS(assets.CSS)
	})

	app.Get("/manifest.json", func(ctx aero.Context) error {
		return ctx.JSON(assets.Manifest)
	})

	app.Get("/words/*file", func(ctx aero.Context) error {
		return ctx.File("words/" + ctx.Get("file"))
	})

	app.Get("/images/*file", func(ctx aero.Context) error {
		return ctx.File("images/" + ctx.Get("file"))
	})

	app.Get("/service-worker", func(ctx aero.Context) error {
		return ctx.File("scripts/ServiceWorker/ServiceWorker.js")
	})

	// Send "Link" header for Cloudflare on HTML responses
	app.Use(func(next aero.Handler) aero.Handler {
		return func(ctx aero.Context) error {
			if !strings.HasPrefix(ctx.Path(), "/_/") && strings.Contains(ctx.Request().Header("Accept"), "text/html") {
				ctx.Response().SetHeader("Link", "</styles>; rel=preload; as=style,</scripts>; rel=preload; as=script")
			}

			return next(ctx)
		}
	})

	return app
}
