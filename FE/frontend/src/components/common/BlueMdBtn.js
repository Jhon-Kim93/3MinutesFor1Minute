import styled from 'styled-components';

const BlueMdBtn = styled.button`
	background-color: ${props => props.theme.accentColor};
	border: none;
	color: ${props => props.theme.backgroundColor};
	border-radius: 6px;
	padding: 2px 16px;
	text-align: center;
	text-decoration: none;
	font-size: 20px;
	cursor: pointer;

	& + & {
		margin-left: 1.5rem;
	}
`;

export default BlueMdBtn;
