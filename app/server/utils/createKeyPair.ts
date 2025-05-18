import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(() => {
	crypto.generateKeyPair(
		'rsa',
		{
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem',
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
				cipher: 'aes-256-cbc',
				passphrase: process.env.KEY_PASSPHRASE,
			},
		},
		(err, publicKey, privateKey) => {
			if (err) console.error(err);
			fs.writeFile(__dirname + '/../keys/id_rsa_pub.pem', publicKey, (err) => {
				if (err) console.error(err);
			});
			fs.writeFile(
				__dirname + '/../keys/id_rsa_priv.pem',
				privateKey,
				(err) => {
					if (err) console.error(err);
				}
			);
		}
	);
})();
