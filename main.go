package main

import (
	"github.com/aerogo/aero"
	"github.com/konnakanji/konnakanji/components"
)

func main() {
	app := aero.New()
	configure(app).Run()
}

func configure(app *aero.Application) *aero.Application {
	app.Get("/", func(ctx *aero.Context) string {
		return ctx.HTML(components.Layout(ctx))
	})

	return app
}
