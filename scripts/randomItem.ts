export default function randomItem<T>(collection: T[]) {
	return collection[Math.floor(Math.random() * collection.length)]
}