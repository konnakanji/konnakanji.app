package assets

import (
	"github.com/aerogo/manifest"
	"github.com/konnakanji/konnakanji/components/css"
	"github.com/konnakanji/konnakanji/components/js"
)

var (
	Manifest *manifest.Manifest
	JS       string
	CSS      string
)

// Load loads the website assets.
func Load() error {
	JS = js.Bundle()
	CSS = css.Bundle()

	var err error
	Manifest, err = manifest.FromFile("manifest.json")
	return err
}
