import type { Area } from 'react-easy-crop';

export default function setCanvasPreview(
	image: HTMLImageElement,
	canvas: HTMLCanvasElement,
	crop: Area,
	dimension: number
) {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('No 2d context');
	}

	const pixelRatio = window.devicePixelRatio;
	const scaledDimension = Math.floor(dimension * pixelRatio);

	canvas.width = scaledDimension;
	canvas.height = scaledDimension;

	// the actual number of pixels on the screen may be higher on larger monitors
	// compared to a css pixel
	ctx.scale(pixelRatio, pixelRatio);
	ctx.imageSmoothingQuality = 'high';
	ctx.save();

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		dimension,
		dimension
	);

	ctx.restore();
}
