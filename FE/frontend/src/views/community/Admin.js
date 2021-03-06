import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import {
	FaUserCircle,
	FaSearch,
	FaUserSlash,
	FaUserCheck,
} from 'react-icons/fa';
import {
	apiApproveMember,
	apiDeleteCommunity,
	apiDeleteMember,
	apiGetCommunityMembers,
	apiInviteUser,
	apiSearchUser,
} from '../../api/community';
import Table from '../../components/common/Table';
import Form from '../../components/auth/Form';
import Label from '../../components/auth/Label';
import IconBtn from '../../components/auth/IconBtn';
import EmptyBtn from '../../components/auth/EmptyBtn';
import routes from '../../routes';
import TextSubTitle from '../../components/common/TextSubTitle';
import TextTitle from '../../components/common/TextTitle';
import UpdateCommunity from '../../components/community/admin/UpdateCommunity';
import UpdateImage from '../../components/community/admin/UpdateImage';

const Divider = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;

	label {
		max-width: 300px;
	}
`;

const AdminContainer = styled.div`
	padding: 20px;
`;

const AdminContents = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	button {
		height: 30px;
		background-color: ${props => props.theme.accentColor};
		color: ${props => props.theme.subFontColor};
	}
`;

const Main = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const TableContainer = styled.div`
	height: 100%;

	img {
		width: 18px;
		height: 18px;
		object-fit: cover;
		border-radius: 50%;
	}

	a {
		text-decoration: none;
		color: inherit;
	}
`;

const ResultContainer = styled.div`
	margin: 20px 0;
	max-width: 350px;
`;

const ResultWrapper = styled.div`
	height: 200px;
	overflow-y: scroll;
	margin-top: 20px;
	border: 1px solid black;
	border-radius: 5px;
`;

const ResultList = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	align-items: start;
	padding: 5px;

	button {
		width: 100%;
		padding: 5px;

		&:hover {
			background-color: ${props => props.theme.confirmColor}33;
		}
	}
`;

const ResultBtn = styled(EmptyBtn)`
	font-size: 18px;
`;

function Admin() {
	const { is_admin: isAdmin } = useSelector(state => state.member);
	const { communityId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [members, setMembers] = useState([]);
	const [result, setResult] = useState([]);
	const {
		register,
		getValues,
		handleSubmit,
		formState: { isValid },
	} = useForm({
		mode: 'all',
	});
	const [isUpdateMode, setUpdateMode] = useState(false);
	const [isImageMode, setImageMode] = useState(false);

	const onValidSubmit = async () => {
		const { keyword } = getValues();
		try {
			const response = await apiSearchUser({ keyword });
			setResult(response.data);
		} catch (e) {
			// error
			setResult([]);
			Swal.fire({
				icon: 'info',
				text: '?????? ????????? ????????????.',
			});
		}
	};

	const handleInvite = async e => {
		const { id, name } = e;

		try {
			await apiInviteUser({ communityId, id });
			Swal.fire({
				icon: 'success',
				text: `${name}?????? ?????????????????????.`,
			});
			getMembers();
		} catch (error) {
			// error
			Swal.fire({
				icon: 'info',
				text: `${error.response.data}`,
			});
		}
	};

	const handleDeleteMember = async e => {
		const { id, nickname } = e;

		try {
			const res = await Swal.fire({
				icon: 'warning',
				text: `${nickname}?????? ?????????????????????????`,
				showCancelButton: true,
				confirmButtonText: '??????',
				cancelButtonText: '??????',
			});
			if (res.isConfirmed) {
				await apiDeleteMember({ communityId, memberId: id });
				Swal.fire({
					icon: 'info',
					text: `${nickname}?????? ?????????????????????.`,
				});
			}
			getMembers();
		} catch (error) {
			// error
		}
	};

	const handleApproveMember = async e => {
		const { id, nickname } = e;

		try {
			// api
			await apiApproveMember({ communityId, memberId: id });
			Swal.fire({
				icon: 'success',
				text: `${nickname} ?????? ????????? ?????????????????????.`,
			});
			getMembers();
		} catch (error) {
			// error
		}
	};

	const handleDeleteCommunity = async () => {
		try {
			const res = await Swal.fire({
				icon: 'warning',
				text: '??????????????? ????????????????????????? "?????????????????????"??? ???????????????.',
				input: 'text',
				showCancelButton: true,
				confirmButtonText: '??????',
				cancelButtonText: '??????',
			});
			if (res.isConfirmed) {
				if (res.value === '?????????????????????') {
					await apiDeleteCommunity({ communityId });
					await Swal.fire({
						icon: 'info',
						text: '?????????????????????.',
					});
					navigate(routes.main);
				}
			}
		} catch (e) {
			// error
			if (e.response.status === 500) {
				Swal.fire({
					icon: 'error',
					text: '???????????? ????????? ????????? ??????????????????.',
				});
			}
		}
	};

	const getMembers = async () => {
		try {
			const response = await apiGetCommunityMembers({ communityId });
			setMembers(response.data);
		} catch (e) {
			// error
		}
	};

	useEffect(() => {
		if (!isAdmin) {
			navigate(`/community/${communityId}`);
		}
		getMembers();
	}, [communityId, location, isAdmin]);

	const searchResults = (
		<ResultContainer>
			????????? ??????
			<ResultWrapper>
				<ResultList>
					{result?.map(e => (
						<ResultBtn key={e.id} onClick={() => handleInvite(e)}>
							{e?.name} - {e?.username}
						</ResultBtn>
					))}
				</ResultList>
			</ResultWrapper>
		</ResultContainer>
	);

	return (
		<Main>
			<Divider>
				<Form onSubmit={handleSubmit(onValidSubmit)}>
					<TextTitle>?????? ??????</TextTitle>
					<Label htmlFor='keyword'>
						<input
							{...register('keyword', {
								required: true,
							})}
							type='text'
							placeholder='??????, ???????????? ????????????'
						/>
						<IconBtn type='submit' disabled={!isValid}>
							<FaSearch />
						</IconBtn>
					</Label>
					{result.length > 0 && searchResults}
				</Form>
				<AdminContainer>
					<TextTitle>???????????? ??????</TextTitle>
					<AdminContents>
						<TextSubTitle>???????????? ?????? ??????</TextSubTitle>
						<button type='button' onClick={() => setUpdateMode(true)}>
							??????
						</button>
					</AdminContents>
					<AdminContents>
						<TextSubTitle>???????????? ????????? ??????</TextSubTitle>
						<button type='button' onClick={() => setImageMode(true)}>
							??????
						</button>
					</AdminContents>
					<AdminContents>
						<TextSubTitle>???????????? ??????</TextSubTitle>
						<button type='button' onClick={handleDeleteCommunity}>
							??????
						</button>
					</AdminContents>
				</AdminContainer>
			</Divider>
			<TableContainer>
				<TextTitle>?????? ??????</TextTitle>
				<Table>
					<thead>
						<tr>
							<th width='25%'>?????????</th>
							<th width='45%'>??????</th>
							<th width='10%'>??????</th>
							<th width='20%'>?????????</th>
						</tr>
					</thead>
					<tbody>
						{members.map(e => (
							<tr key={e.id}>
								<td>
									<Link to={`/community/${communityId}/member/${e.nickname}`}>
										{e.profile_image ? (
											<img
												src={`${process.env.REACT_APP_MEDIA_URL}${e.profile_image}`}
												alt=''
											/>
										) : (
											<FaUserCircle />
										)}
										{e.nickname}
										{e.is_admin && '[?????????]'}
										{!e.is_active && '[?????????]'}
									</Link>
								</td>
								<td>{e.bio}</td>
								<td>
									{!e.is_active && (
										<IconBtn
											title='?????? ??????'
											type='button'
											style={{ color: 'blue' }}
											onClick={() => handleApproveMember(e)}
										>
											<FaUserCheck />
										</IconBtn>
									)}
									{!e.is_admin && (
										<IconBtn
											title='??????'
											type='button'
											style={{ color: 'red' }}
											onClick={() => handleDeleteMember(e)}
										>
											<FaUserSlash />
										</IconBtn>
									)}
								</td>
								<td>{e.created_at.split('T')[0].split('-').join('. ')}.</td>
							</tr>
						))}
					</tbody>
				</Table>
			</TableContainer>
			{isUpdateMode && <UpdateCommunity setMode={setUpdateMode} />}
			{isImageMode && <UpdateImage setMode={setImageMode} />}
		</Main>
	);
}

export default Admin;
