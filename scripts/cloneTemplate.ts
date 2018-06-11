export default function cloneTemplate(name: string) {
	let template = document.getElementById(name) as HTMLTemplateElement
	return template.content.cloneNode(true) as DocumentFragment
}