import { isNil } from './helpers';

export default function dropboxUrl(url) {
	if (isNil) return '';
	return url
		.replace(/&dl=0(?!.*&dl=0)/, '&raw=1')
		.replace('www.dropbox.com', 'dl.dropbox.com');
}
