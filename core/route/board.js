/**
 * 게시판 라우팅 파일
 * @type {*|exports}
 */

var express = require('express'),
    router = express.Router(),
    u = require('../Util');

var boardController = require('../controller/boardCont');

/* Middleware */
router.use( function(req, res, next) {
    next();
});

router.use( function(req, res, next) {
    var sess = req.session;
    if( !sess.member || !sess.hasOwnProperty('member') ) {
        throw u.error(' 권한이 없습니다 ', 403, true);
    }

    next();
})

/* 튜토리얼 아이디 주입 */
router.param('tid', function(req, res, next, tid) {
    req.tid = tid;
    next();
})

/* 게시판 리스트 페이지 번호 주입 */
router.param('page', function(req, res, next, page) {
    req.page = page;
    next();
})

/* 게시판 글 고유번호(DB상) 번호 */
router.param('bid', function(req, res, next, bid) {
    req.bid = bid;
    next();
})


/* Routing */
router.get('/:tid+/view', boardController.getArticleListView); /* 게시판 리스트 뷰 컨트롤러 */
router.get('/:tid+/:page?', boardController.getArticleList); /* 게시판 리스트 컨트롤러 */
router.post('/:tid', boardController.postArticle); /* 게시판 글 작성 컨트롤러 */
router.delete('/:bid', boardController.removeArticle); /* 게시판 글 삭제 컨트롤러 */
router.put('/:bid', boardController.modifyArticle); /* 게시판 글 수정 컨트롤러 */




/* EXPORT */
module.exports = router;