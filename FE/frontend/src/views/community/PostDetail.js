import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
	apiGetBoardDetail,
	apiPutBoardDetail,
	apiDeleteBoardDetail,
	apiDeleteComment,
	apiPutComment,
} from '../../api/board';
import routes from '../../routes';
import CommentInput from './CommentInput';
import Label from '../../components/auth/Label';
import AreaLabel from '../../components/auth/AreaLabel';
import SubmitButton from '../../components/auth/SubmitButton';
import ComMain from '../../components/community/MainStart';
import Background from '../../components/community/board/list/Background';
import Header from '../../components/community/board/list/Header';
import TextTitle from '../../components/common/TextTitle';
import SmallBtn from '../../components/community/board/list/SmallBtn';
import NForm from '../../components/community/board/list/NForm';
import BlueMdBtn from '../../components/common/BlueMdBtn';
import RedMdBtn from '../../components/common/RedMdBtn';
import BtnBox from '../../components/community/BtnBox';

const SButton = styled(SubmitButton)`
border: none;
`
const CSmallBtn = styled(SmallBtn)`
padding: 3px;
width: 70px;
border: none;
`
const DSmallBtn = styled(SmallBtn)`
padding: 3px;
width: 70px;
border: none;
background-color: ${props => props.theme.warnColor};
`
const TopBtnBox = styled(BtnBox)`
	display: ${props => (props.isAuthor ? 'flex' : 'none')};
	width: 60%;
`;
const UpdateBtn = styled(BlueMdBtn)`
	margin-right: 10px;
`;
const DeleteBtn = styled(RedMdBtn)`
	margin-right: 10px;
`;
const CreateBtn = styled(BlueMdBtn)`
`;
const Detail = styled.div`
	display: flex;
	flex-direction: column;
	padding: 15px;
	border: 1px solid black;
	margin-top: 15px;
	flex-wrap: wrap;

	p {
		margin: 5px;
	}
`;

const CommentLine = styled.div`
	padding-left: 5px;
	margin-top: 2px;
	width: 100%;
	display: flex;
    align-items: center;
    justify-content: space-between;
	height: 37px;
`;

const CommentList = styled.div`
	width: 100%;
`;

const DetailContent = styled.div`
	font-size: 18px;
	margin: 10px;
`;

const CLabel = styled.label`
border-bottom: 1px solid black;
	display: flex;
	align-items: center;

	input {
		border: none;
		background: none;
		margin: 5px;
		font-size: 20px;

		:focus {
			outline: none;
		}
	}
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		transition: background-color 9999s;
		-webkit-text-fill-color: inherit;
	}
	input {
		width: 100%;
		font-size: 15px;
	}
`;

const CForm = styled(NForm)`
	padding: 0px;
	width: 100%;
`;

function PostDetail() {
	const { communityId, postId } = useParams();

	const { nickname } = useSelector(state => state.member);
	const { username, id } = useSelector(state => state.user);
	const [post, setPost] = useState({});
	const [targetComment, setTargetComment] = useState({});
	const [isPostUpdating, setPostUpdating] = useState(false);
	const [isCommentUpdating, setCommentUpdating] = useState(false);
	const navigate = useNavigate();
	const { register, handleSubmit, getValues, setValue } = useForm({
		mode: 'all',
	});
	const {
		register: cRegister,
		handleSubmit: cHandleSubmit,
		getValues: cGetValues,
		setValue: cSetValue,
	} = useForm({
		mode: 'all',
	});

	useEffect(() => {
		getPost();
	}, [communityId, postId]);

	const getPost = async () => {
		try {
			await apiGetBoardDetail({ communityId, postId }).then(res => {
				setPost(res.data);
				setValue('title', res.data?.title);
				setValue('content', res.data?.content);
				setValue('isNotice', res.data?.isNotice);
				setValue('upload', res.data?.upload);
			});
		} catch (e) {
			// error
		}
	};

	const deletePost = async () => {
		try {
			await apiDeleteBoardDetail({ communityId, postId });
			await Swal.fire({
				icon: 'success',
				text: '???????????? ?????????????????????.',
			});
			navigate(`${routes.community}/${communityId}/${routes.posts}`);
		} catch (e) {
			// error
			await Swal.fire({
				icon: 'error',
				text: '?????? ??????, ?????? ?????? ???, ?????? ???????????????.',
			});
		}
	};

	const deleteComment = async commentId => {
		try {
			await apiDeleteComment({ communityId, postId, commentId });
			await Swal.fire({
				icon: 'success',
				text: '????????? ?????????????????????.',
			});
			window.location.reload(true);
		} catch (e) {
			// error
			await Swal.fire({
				icon: 'error',
				text: '?????? ??????, ?????? ?????? ???, ?????? ???????????????.',
			});
		}
	};

	const handleDeletePost = async () => {
		await Swal.fire({
			title: '?????? ?????????????????????????',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#dd3333',
			cancelButtonText: '??????',
			confirmButtonText: '??????',
		}).then(result => {
			if (result.isConfirmed) {
				deletePost();
			}
		});
	};

	const handleDeleteComment = async commentId => {
		await Swal.fire({
			title: '?????? ?????????????????????????',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#dd3333',
			cancelButtonText: '??????',
			confirmButtonText: '??????',
		}).then(result => {
			if (result.isConfirmed) {
				deleteComment(commentId);
			}
		});
	};

	const onValidSubmitPost = async () => {
		const { title, content, isNotice, upload } = getValues();
		try {
			await apiPutBoardDetail({
				communityId,
				postId,
				title,
				content,
				isNotice,
				upload,
			}).then(res => {
				setPost(res.data);
			});
			await Swal.fire({
				icon: 'success',
				text: '????????? ?????????????????????.',
			});
			setPostUpdating(false);
		} catch (error) {
			// error
			if(error.response.status === 400){
				await Swal.fire({
					icon: 'error',
					text: '????????? ?????? 5????????? ????????? ??? ????????????.',
				});
			}else{
				await Swal.fire({
					icon: 'error',
					text: '????????? ?????????????????????.',
				});
			}
		}
	};

	const onValidSubmitComment = async () => {
		const { content } = cGetValues();
		try {
			await apiPutComment({
				communityId,
				postId,
				commentId: targetComment.id,
				content,
			});
			await Swal.fire({
				icon: 'success',
				text: '????????? ?????????????????????.',
			});
			getPost();
			setCommentUpdating(false);
		} catch (e) {
			// error
			await Swal.fire({
				icon: 'error',
				text: '????????? ?????????????????????.',
			});
		}
	};

	// isPostUpdating True -> ?????? False -> ??? ????????????
	const contents = isPostUpdating ? (
		// True
		<Background>
			<Header>
				<TextTitle>??? ??????</TextTitle>
				<CreateBtn
					onClick={() =>
						setPostUpdating(false)
					}
				>
					????????????
				</CreateBtn>
			</Header>
			<NForm onSubmit={handleSubmit(onValidSubmitPost)}>
				<Label htmlFor='title'>
					<input
						{...register('title', {
							required: true,
						})}
						type='title'
						placeholder='?????? ??????'
					/>
				</Label>
				<Label htmlFor='isNotice'>
					????????????
					<input {...register('isNotice')} type='checkbox' />
				</Label>
				<AreaLabel htmlFor='content'>
					<textarea
						{...register('content', {
							required: true,
						})}
						cols='60'
						rows='10'
						placeholder='?????? ??????'
					/>
				</AreaLabel>
				{/* <Label htmlFor='upload'>
					????????????
					<input {...register('upload')} type='file' multiple />
				</Label> */}
				<SubmitButton type='submit'>??????</SubmitButton>
			</NForm>
		</Background>
	) : (
		// False
		<Background>
			<Header>
				<TextTitle>??? ????????????</TextTitle>
				{/* ????????? & ???????????? ?????? ????????? ????????? ?????? */}
				{post?.member?.nickname === nickname ? (
					<BtnBox>
						<CreateBtn
							onClick={() =>
								navigate(`${routes.community}/${communityId}/${routes.posts}`)
							}
						>
							????????????
						</CreateBtn>
						<UpdateBtn type='button' onClick={() => setPostUpdating(true)}>
							??????
						</UpdateBtn>
						<DeleteBtn type='button' onClick={() => handleDeletePost()}>
							??????
						</DeleteBtn>
					</BtnBox>
				) : (
				<CreateBtn
					onClick={() =>
						navigate(`${routes.community}/${communityId}/${routes.posts}`)
					}
				>
					????????????
				</CreateBtn>
				)}
			</Header>
			<Detail>
				<DetailContent>?????? : {post?.title}</DetailContent>
				<DetailContent>????????? : {post?.member?.nickname}</DetailContent>
				<DetailContent>???????????? : {dayjs(post?.created_at).format('YYYY-MM-DD HH:mm:ss')}</DetailContent>
				<DetailContent>?????? : {post?.content}</DetailContent>
				{/* <p>???????????? {post?.upload}</p> */}

				<DetailContent>??????({post?.board_comments?.length})</DetailContent>
				<CommentInput />
				{post?.board_comments?.map(comment => (
					<CommentList key={comment.id}>
						<CommentLine>
							{/* ?????? update true */}
							{isCommentUpdating && comment === targetComment ? (
								<CForm onSubmit={cHandleSubmit(onValidSubmitComment)}>
									<CLabel htmlFor='content'>
										<CommentLine>
											<input
												{...cRegister('content', {
													required: true,
												})}
												type='content'
												placeholder='?????? ??????'
											/>
											<CSmallBtn type='submit'>??????</CSmallBtn>
											<CSmallBtn
												type='button'
												onClick={() => {
													setCommentUpdating(false);
													setTargetComment({});
												}}
											>
												??????
											</CSmallBtn>
										</CommentLine>
									</CLabel>
								</CForm>
							) : (
								// ?????? update false
								<CommentLine>
									<div>
									{comment?.member?.nickname}({dayjs(comment?.updated_at).format('YYYY-MM-DD')}) : {comment?.content}
									</div>
									{/* ????????? ?????? === ?????? ????????? ?????? ????????? ????????? ??? */}
									{comment?.member?.nickname === nickname ? (
										<div>
											<CSmallBtn
												type='button'
												onClick={() => {
													setCommentUpdating(true);
													setTargetComment(comment);
													cSetValue('content', comment.content);
												}}
											>
												??????
											</CSmallBtn>
											<DSmallBtn
												type='button'
												onClick={() => handleDeleteComment(comment.id)}
											>
												??????
											</DSmallBtn>
										</div>
									) : null}
								</CommentLine>
							)}
						</CommentLine>
					</CommentList>
				))}
			</Detail>
		</Background>
	);

	return <ComMain>{contents}</ComMain>;
}

export default PostDetail;
