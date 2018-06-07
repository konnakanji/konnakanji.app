package main

import (
	"github.com/aerogo/aero"
	"github.com/konnakanji/konnakanji/components"
	"github.com/konnakanji/konnakanji/components/js"
)

func main() {
	app := aero.New()
	configure(app).Run()
}

func configure(app *aero.Application) *aero.Application {
	app.Security.Load(
		"security/default/fullchain.pem",
		"security/default/privkey.pem",
	)

	app.Get("/", func(ctx *aero.Context) string {
		return ctx.HTML(components.Layout(ctx))
	})

	app.Get("/scripts", func(ctx *aero.Context) string {
		return ctx.JavaScript(js.Bundle())
	})

	return app
}
