import type { NavigateFunction } from 'react-router';

const navigation: {
	navigate: null | NavigateFunction;
	setNavigate: (nav: NavigateFunction) => void;
} = {
	navigate: null,
	setNavigate: (nav: NavigateFunction) => {
		navigation.navigate = nav;
	},
};

export default navigation;
