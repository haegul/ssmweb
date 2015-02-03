/**
 * Created by Lee on 2015-01-28.
 */
var u = require('../Util');
var boardDA = require('../dataAccess/boardDA');
var crypto = require('crypto');
var async = require('async');


var service = {

    /**
     * 게시글 리스팅 서비스
     * @param sParam
     * @param resultCallback
     */
        getArticleList : function( sParam, resultCallback) {
            u.assert( sParam.tid > 0 );
            u.assert( sParam.page > 0 );
            if( !sParam.countOffset ) sParam.countOffset = 10;

            // 시작점
            var startOffset = (sParam.page -1) * sParam.countOffset;
            sParam.startOffset = startOffset;

            boardDA.getArticleList( sParam, function(result) {
                //-- DA 에서 받아온 데이터 콜백으로 넘김
                //-- 나중에 뭔가 처리를 위해서..
                resultCallback( result );
            })
        },


    /**
     * 게시글 작성 서비스
     * @param article
     * @param resultCallback
     */
        postArticle : function( article, resultCallback) {
            u.assert(article.memberSeq);
            u.assert(article.content && article.content.length > 0);

            boardDA.postArticle(article, function(insertId) {

                if( article.parentSeq == -1 ) {
                    boardDA.updateParentSeq( insertId, function( affectRow ) {
                        resultCallback( insertId );
                    })
                }
                else {
                    resultCallback( insertId );
                }

            });
        },

    /**
     * 부모글 갯수 조회 서비스
     * @param tid
     * @param resultCallback
     */
        getParentArticleCount : function( tid, resultCallback) {
            u.assert( tid );
            boardDA.getParentArticleCount(tid, function(result) {
                resultCallback( parseInt(result[0].count) );
            });
        },


    /**
     * 게시글 삭제 서비스
     * @param bid
     * @param member
     * @param resultCallback
     */
        removeArticle : function( bid, member, resultCallback) {

            u.assert( bid , '잘못된 접근입니다. ', 500);
            u.assert( member , '사용 권한이 없습니다.', 403);

            async.waterfall([

                /* 해당 번호에 해당하는 게시글 가져옴 */
                function getArticleBySeq( _callback ) {
                    boardDA.getArticleBySeq(bid, function(result) {
                        u.assert( result.length > 0  );

                        _callback( null, result[0]);
                    })
                },

                /* 해당글을 삭제할수있는 유저인지 확인 */
                function isValidUser( article, _callback) {
                    if( article.memberSeq != member.seq ) {
                        throw u.error(' 사용 권한이 없습니다.', 403 );
                    }

                    _callback( null, article );
                },

                /* 게시글 종류에 따른 삭제작업 */
                function removeArticle( article, _callback) {

                    // 부모글 삭제라면
                    if( article.seq == article.parentSeq ) {
                        boardDA.removeArticleParentAndChild(bid, function(result) {
                            _callback(null, result);
                        })
                    }
                    // 아니라면
                    else {
                        boardDA.removeArticleBySeq(bid, function(result) {
                            _callback(null, result);
                        })
                    }

                }


            ],
                /* 최종 콜백 */
                function finalExec(err, result) {
                    resultCallback(result);
                }

            )

        }


}



/* EXPORT */
module.exports = service;