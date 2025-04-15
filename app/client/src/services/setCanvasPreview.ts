import type { Area } from 'react-easy-crop';

export default function setCanvasPreview(
	image: HTMLImageElement,
	canvas: HTMLCanvasElement,
	crop: Area
) {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('No 2d context');
	}

	const pixelRatio = window.devicePixelRatio;

	canvas.width = Math.floor(crop.width * pixelRatio);
	canvas.height = Math.floor(crop.height * pixelRatio);

	// the actual number of pixels on the screen may be higher on larger monitors
	// compared to a css pixel
	ctx.scale(pixelRatio, pixelRatio);
	ctx.imageSmoothingQuality = 'high';
	ctx.save();

	// move the crop origin to the canvas origin
	ctx.translate(-crop.x, -crop.y);
	ctx.drawImage(
		image,
		0,
		0,
		image.naturalWidth,
		image.naturalHeight,
		0,
		0,
		image.naturalWidth,
		image.naturalHeight
	);

	ctx.restore();
}
