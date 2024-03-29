import { usersAPI } from '../api/api';
import { updateObjectInArray } from '../utils/constans';

const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET-USERS';
const SET_CURRENT_PAGE = 'SET-CURRENT-PAGE';
const SET_TOTAL_USERS_COUNT = 'SET-TOTAL-USERS-COUNT';
const TOGGLE_IS_LOADING = 'TOGGLE-IS-LOADING';
const TOGGLE_IS_FOLLOWING_PROGRESS = 'TOGGLE-IS-FOLLOWING-PROGRESS';

let initialState = {
   users: [],
   pageSize: 5,
   totalUsersCount: 0,
   currentPage: 1,
   isLoading: false,
   followingInProgress: [],
}

const usersReducer = (state = initialState, action) => {
   switch (action.type) {
      case FOLLOW: {
         return {
            ...state,
            users: updateObjectInArray(state.users, action.userId, 'id', { followed: true }) //заменили универсальной функцией
            // users: state.users.map((user) => {
            //    if (user.id === action.userId) {
            //       return { ...user, followed: true }
            //    }
            //    return user;
            // })
         }
      }
      case UNFOLLOW: {
         return {
            ...state,
            users: updateObjectInArray(state.users, action.userId, 'id', { followed: false }) //заменили универсальной функцией
            // users: state.users.map((user) => {
            //    if (user.id === action.userId) {
            //       return { ...user, followed: false }
            //    }
            //    return user;
            // })
         }
      }
      case SET_USERS: {
         return {
            ...state,
            users: action.users
         }
      }
      case SET_CURRENT_PAGE: {
         return {
            ...state,
            currentPage: action.currentPage
         }
      }
      case SET_TOTAL_USERS_COUNT: {
         return {
            ...state,
            totalUsersCount: action.totalUsersCount
         }
      }
      case TOGGLE_IS_LOADING: {
         return {
            ...state,
            isLoading: action.isLoading
         }
      }
      case TOGGLE_IS_FOLLOWING_PROGRESS: {
         return {
            ...state,
            followingInProgress: action.followingInProgress ?
               [...state.followingInProgress, action.userId] :
               state.followingInProgress.filter(id => id !== action.userId)
         }
      }
      default:
         return state;
   }
}

export const followSuccess = (userId) => ({ type: FOLLOW, userId })
export const unfollowSuccess = (userId) => ({ type: UNFOLLOW, userId })
export const setUsers = (users) => ({ type: SET_USERS, users })
export const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE, currentPage })
export const setUsersTotalCount = (totalUsersCount) => ({ type: SET_TOTAL_USERS_COUNT, totalUsersCount })
export const toggleIsLoading = (isLoading) => ({ type: TOGGLE_IS_LOADING, isLoading })
export const toggleFollowingProgress = (followingInProgress, userId) => ({ type: TOGGLE_IS_FOLLOWING_PROGRESS, followingInProgress, userId })

// thunk (внутренняя функция, а внешняя thunkCreat )

export const getUsers = (currentPage, pageSize) => async (dispatch) => {
   dispatch(toggleIsLoading(true));
   let data = await usersAPI.getUsers(currentPage, pageSize);

   dispatch(toggleIsLoading(false))
   dispatch(setUsers(data.items))
   dispatch(setUsersTotalCount(data.totalCount))
   dispatch(setCurrentPage(currentPage))
}

const followUnfollowFlow = async (dispatch, userId, apiMethod, actionCreator) => {
   dispatch(toggleFollowingProgress(true, userId));
   let response = await apiMethod(userId);

   if (response.data.resultCode === 0) {
      dispatch(actionCreator(userId))
   }
   dispatch(toggleFollowingProgress(false, userId));
} // универсальная функция (метод) для сокращения кода в follow/unfollow 

export const follow = (userId) => async (dispatch) => {
   followUnfollowFlow(dispatch, userId, usersAPI.follow.bind(usersAPI), followSuccess)
}

export const unfollow = (userId) => async (dispatch) => {
   followUnfollowFlow(dispatch, userId, usersAPI.unfollow.bind(usersAPI), unfollowSuccess)
}

export default usersReducer;

// export const follow = (userId) => async (dispatch) => {
//    dispatch(toggleFollowingProgress(true, userId))
//    let response = await usersAPI.follow(userId);

//    if (response.data.resultCode === 0) {
//       dispatch(followSuccess(userId))
//    }
//    dispatch(toggleFollowingProgress(false, userId))
// }

// export const unfollow = (userId) => async (dispatch) => {
//    dispatch(toggleFollowingProgress(true, userId))
//    let response = await usersAPI.unfollow(userId);

//    if (response.data.resultCode === 0) {
//       dispatch(unfollowSuccess(userId))
//    }
//    dispatch(toggleFollowingProgress(false, userId))
// }