export default function copyToClipboard(str: string) {
	const area = document.createElement("textarea")
	area.value = str
	area.setAttribute("readonly", "")
	area.style.position = "absolute"
	area.style.left = "-9999px"
	document.body.appendChild(area)
	area.select()
	document.execCommand("copy")
	document.body.removeChild(area)
}