package main

import (
	"github.com/aerogo/aero"
	"github.com/konnakanji/konnakanji/components"
	"github.com/konnakanji/konnakanji/components/css"
	"github.com/konnakanji/konnakanji/components/js"
)

var mainApp = aero.New()

func main() {
	configure(mainApp).Run()
}

func configure(app *aero.Application) *aero.Application {
	app.Security.Load("security/server.crt", "security/server.key")

	appCode := func(ctx *aero.Context) string {
		return ctx.HTML(components.Layout(ctx))
	}

	app.Get("/", appCode)
	app.Get("/test/*name", appCode)

	app.Get("/scripts", func(ctx *aero.Context) string {
		return ctx.JavaScript(js.Bundle())
	})

	app.Get("/styles", func(ctx *aero.Context) string {
		return ctx.CSS(css.Bundle())
	})

	app.Get("/manifest.json", func(ctx *aero.Context) string {
		return ctx.JSON(app.Config.Manifest)
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

	// Uncomment this line if you need inline web workers:
	// app.ContentSecurityPolicy.Set("worker-src", "'self' blob:")

	return app
}
