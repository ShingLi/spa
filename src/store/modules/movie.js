import { saveComment,loadComment } from "../../common/js/cache" ;
const state ={
    movie:{},
    favoriteComments:loadComment()
}

const mutations ={
    setMovie(state,payload){
        state.movie= payload
    },
    set_favorite_comments(state,comments){
        console.log(comments);
        state.favoriteComments = comments;

    }
}

const getters={
    movie:state=>state.movie,
    favoriteComments:state => state.favoriteComments
}

const actions = {
    markComment({commit},id){
        commit('set_favorite_comments',saveComment(id))
    }
}
export default {
    state,
    mutations,
    getters,
    actions
}
