document.addEventListener('DOMContentLoaded', () => {
	const imageUpload = document.getElementById('imageUpload')
	const pixelSizeInput = document.getElementById('pixelSize')
	const colorPaletteSelect = document.getElementById('colorPalette')
	const pixelCanvas = document.getElementById('pixelCanvas')
	const saveButton = document.getElementById('saveButton')
	const context = pixelCanvas.getContext('2d')
	let isImageLoaded = false
	let previousPixelSize = parseInt(pixelSizeInput.value)
	let imageData

	imageUpload.addEventListener('change', handleImageUpload)
	pixelSizeInput.addEventListener('change', generatePixelArt)
	colorPaletteSelect.addEventListener('change', generatePixelArt)
	saveButton.addEventListener('click', saveImage)

	function handleImageUpload(event) {
		const file = event.target.files[0]
		const reader = new FileReader()

		reader.onload = function (event) {
			const img = new Image()
			img.onload = function () {
				pixelCanvas.width = img.width
				pixelCanvas.height = img.height
				context.drawImage(img, 0, 0)
				imageData = context.getImageData(0, 0, pixelCanvas.width, pixelCanvas.height)
				generatePixelArt()
				isImageLoaded = true
				pixelSizeInput.disabled = true
				saveButton.style.display = 'block'
			}
			img.src = event.target.result
		}

		reader.readAsDataURL(file)
	}

	function generatePixelArt() {
		const pixelSize = parseInt(pixelSizeInput.value)

		if (isImageLoaded && pixelSize < previousPixelSize) {
			pixelSizeInput.value = previousPixelSize
		} else {
			previousPixelSize = pixelSize
		}

		const colorPalette = colorPaletteSelect.value
		const pixels = imageData.data

		pixelCanvas.width = pixelCanvas.width // Clear canvas
		pixelCanvas.height = pixelCanvas.height // Clear canvas

		for (let y = 0; y < pixelCanvas.height; y += pixelSize) {
			for (let x = 0; x < pixelCanvas.width; x += pixelSize) {
				const pixelIndex = (y * pixelCanvas.width + x) * 4
				const r = pixels[pixelIndex]
				const g = pixels[pixelIndex + 1]
				const b = pixels[pixelIndex + 2]
				const a = pixels[pixelIndex + 3]

				context.fillStyle = getColor(colorPalette, r, g, b, a)
				context.fillRect(x, y, pixelSize, pixelSize)
			}
		}
	}

	function getColor(colorPalette, r, g, b, a) {
		if (colorPalette === 'bw') {
			const grayscale = (r + g + b) / 3
			return `rgba(${grayscale}, ${grayscale}, ${grayscale}, ${a})`
		} else if (colorPalette === 'rgb') {
			return `rgba(${r}, ${g}, ${b}, ${a})`
		} else if (colorPalette === 'grayscale') {
			const grayscale = (r + g + b) / 3
			return `rgba(${grayscale}, ${grayscale}, ${grayscale}, ${a})`
		} else if (colorPalette === 'sepia') {
			const sepiaR = r * 0.393 + g * 0.769 + b * 0.189
			const sepiaG = r * 0.349 + g * 0.686 + b * 0.168
			const sepiaB = r * 0.272 + g * 0.534 + b * 0.131
			return `rgba(${sepiaR}, ${sepiaG}, ${sepiaB}, ${a})`
		} else if (colorPalette === 'invert') {
			const invertedR = 255 - r
			const invertedG = 255 - g
			const invertedB = 255 - b
			return `rgba(${invertedR}, ${invertedG}, ${invertedB}, ${a})`
		} else if (colorPalette === 'red') {
			return `rgba(${r}, 0, 0, ${a})`
		} else if (colorPalette === 'green') {
			return `rgba(0, ${g}, 0, ${a})`
		} else if (colorPalette === 'blue') {
			return `rgba(0, 0, ${b}, ${a})`
		}
	}

	function saveImage() {
		const dataURL = pixelCanvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.href = dataURL
		link.download = 'pixel-art.png'
		link.click()
	}
})
