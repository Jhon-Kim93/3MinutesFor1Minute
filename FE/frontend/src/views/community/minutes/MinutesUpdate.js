import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import routes from '../../../routes';
import { updateMinutesByData } from '../../../store/minutes';
import Container from '../../../components/community/Container';
import BlueMdBtn from '../../../components/common/BlueMdBtn';
import RedMdBtn from '../../../components/common/RedMdBtn';
import TextSubTitle from '../../../components/common/TextSubTitle';
import DivLine from '../../../components/community/main/DivLine';
import Form from '../../../components/auth/Form';
import Label from '../../../components/auth/Label';
import TextContent from '../../../components/common/TextContent';
import AreaLabel from '../../../components/auth/AreaLabel';
import ContentBox from '../../../components/community/minutes/create/ContentBox';
import DateTime from '../../../components/community/minutes/create/DateTime';
import InputFile from '../../../components/community/minutes/create/InputFile';
import LabelFile from '../../../components/community/minutes/create/LabelFile';

const CreateForm = styled(Form)`
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	background-color: inherit;
	width: 100%;
`;
const CreateContainer = styled(Container)`
	align-content: flex-start;
	align-items: center;
	width: 750px;
	height: auto;
	margin: 15px 20%;
`;
const InputLabel = styled(Label)`
	width: 600px;

	input {
		width: 100%;
	}
`;
const TextLabel = styled(AreaLabel)`
	margin-left: 10px;
	textarea {
		margin: 0;
		width: 650px;
	}
`;
const CompleteBtn = styled(BlueMdBtn)`
	margin-left: 350px;
`;
const CancelBtn = styled(RedMdBtn)`
	margin-left: 10px;
`;
const ErrorMsg = styled.div`
	padding-top: 5px;
	width: 670px;
	text-align: end;
	font-size: 15px;
	color: ${props => props.theme.warnColor};
`;
const Br = styled.div`
	width: 100%;
	margin-top: 10px;
`;
const TextUpload = styled(TextContent)`
	font-size: 16px;
`;

function MinutesUpdate() {
	// ????????? ?????? ??????
	const { communityId, minutesId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// ?????? ????????? ??????
	const singleMinutes = useSelector(state => state.minutes.singleMinutes);
	// useform ??????
	const {
		register,
		handleSubmit,
		watch,
		getValues,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		// create??? ?????? ??????
		defaultValues: singleMinutes,
	});
	// form ?????? ??????
	function onValidSubmit(data) {
		const formData = new FormData();
		const polishedDeadline = data.deadline.slice(0, 16);
		if (data.upload[0]) {
			formData.append(`reference_file`, data.upload[0]);
		}
		formData.append('enctype', 'multipart/form-data');
		formData.append('title', data.title);
		formData.append('content', data.content);
		formData.append('deadline', polishedDeadline);
		// navigate??? ?????? ???
		formData.append('comId', communityId);
		formData.append('minId', minutesId);
		try {
			dispatch(updateMinutesByData(formData)).then(res => {
				if (res.payload === 400) {
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: '?????? ??????! ????????? ??????????????????!',
						showConfirmButton: false,
						timer: 1500,
					});
				} else {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: '???????????? ?????????????????????..',
						showConfirmButton: false,
						timer: 1500,
					});
					const { community, id } = res.payload;
					navigate(`/community/${community}/minutes/${id}`);
				}
			});
		} catch (error) {
			Swal.fire({
				position: 'top-end',
				icon: 'error',
				title: '?????? ??????, ??????????????? ??????????????????.',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	}
	// ????????? ??? ?????? ???????????? ?????? ??????
	const uploadedFiles = watch('upload');
	const fileList = uploadedFiles ? Object.values(uploadedFiles) : [];

	return (
		<CreateContainer>
			{/* ?????? */}
			<TextSubTitle>????????? ??????</TextSubTitle>
			<CompleteBtn type='submit' form='createForm'>
				?????? ??????
			</CompleteBtn>
			<CancelBtn
				onClick={() =>
					navigate(`${routes.community}/${communityId}/minutes/${minutesId}`)
				}
			>
				?????? ??????
			</CancelBtn>
			<DivLine />
			{/* Form Body */}
			<ContentBox>
				<CreateForm id='createForm' onSubmit={handleSubmit(onValidSubmit)}>
					{/* ?????? */}
					<TextContent>?????? :</TextContent>
					<InputLabel htmlFor='title'>
						<input
							{...register('title', {
								required: '????????? ??????????????????.',
								maxLength: { value: 100, message: '100??? ????????? ??????????????????.' },
							})}
							type='title'
							placeholder='?????? ??????'
						/>
					</InputLabel>
					<ErrorMsg>{errors?.title?.message}</ErrorMsg>
					<Br />
					{/* ????????? */}
					<TextContent>????????? : {singleMinutes.participants.join(', ')}</TextContent>
					<Br />
					{/* ????????? */}
					<TextContent>
						????????? :{' '}
						<DateTime
							{...register('deadline', {
								required: '?????? ???????????? ??????????????????',
							})}
							type='datetime-local'
						/>
						<ErrorMsg style={{ textAlign: 'center' }}>
							{errors?.Dday?.message}
						</ErrorMsg>
					</TextContent>
					<Br />
					<TextContent>?????? ??????</TextContent>
					<Br />
					<TextLabel htmlFor='content'>
						<textarea
							{...register('content', {
								required: '????????? ??????????????????.',
								maxLength: { value: 300, message: '300??? ????????? ??????????????????.' },
							})}
							cols='90'
							rows='10'
							placeholder='?????? ??????'
						/>
					</TextLabel>
					<ErrorMsg>{errors?.content?.message}</ErrorMsg>
					<Br />
					<TextUpload>?????? ?????? : </TextUpload>
					<LabelFile htmlFor='file'>?????????</LabelFile>
					<InputFile
						{...register('upload')}
						id='file'
						type='file'
						multiple
						accept='.ppt, .pptx, .docs, .pdf, .word, .hwp, .png'
					/>
					<Br style={{ margin: '0' }} />
					{fileList.map(file => (
						<TextUpload key={file.name}>{file.name}</TextUpload>
					))}
				</CreateForm>
			</ContentBox>
		</CreateContainer>
	);
}

export default MinutesUpdate;
