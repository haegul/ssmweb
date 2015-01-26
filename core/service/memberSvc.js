/**
 * Created by Lee on 2015-01-23.
 */
var u = require('../Util');
var memberDA = require('../dataAccess/memberDA');
var crypto = require('crypto');

var service = {

    /* 아이디를 통해 해당 유저 정보 가져옴 */
    getMemberById : function( userid, resultCallback) {
        u.assert( userid );
        u.assert( userid.length > 0 );

        memberDA.getMemberById( userid, resultCallback);
    },

    /* 멤버 추가 */
    insertMember : function( member, resultCallback) {
        u.assert( member.userid || member.userpwd );
        u.assert( member.userid.length > 0 || member.userpwd.length > 0 );

        var sMember = {
            userid : member.userid,
            userpwd : crypto.createHash('sha512').update( member.userpwd).digest('hex')
        };

        memberDA.insertMember( sMember, function(result) {
            resultCallback(result);
        })
    },

    /* 멤버 로그인 서비스 */
    procMemberLogin : function( member, resultCallback) {
        u.assert( member.userid || member.userpwd );
        u.assert( member.userid.length > 0 || member.userpwd.length > 0 );

        var sMember = {
            userid : member.userid,
            userpwd : crypto.createHash('sha512').update( member.userpwd).digest('hex')
        };

        memberDA.getMemberById( sMember.userid, function(result) {
            console.log( result, sMember.userpwd == result.userpwd, sMember.userpwd );
            if( result && result.userpwd == sMember.userpwd) {
                resultCallback( result );
            }
            else {
                resultCallback( false );
            }
        })
    },

    /* 세션에서 사용할 멤버 객체 가공 생성 */
    createMemberSession : function(req, member) {
        var sess = req.session;
        if( !sess) return;

        sess.member = {
            userid : member.userid,
            seq : parseInt(member.seq),
            lastlogin : new Date()
        };
    },

    /* 세션 만료 */
    removeMemberSession : function(req) {
        var sess = req.session;
        if( !sess) return;

        if( sess.hasOwnProperty('member') ) {
            delete sess.member;
            sess.member = null;
        }
    },

    /* 세션 멤버정보와 주어진 멤버 정보가 같은지 ? */
    assertMemberEqual : function(req, member) {
        var sess = req.session;
        if( !sess) return false;
        if( !sess.member) return false;

        if( sess.member.userid != member.userid ) return false;
        if( sess.member.seq != member.seq ) return false;
        return true;
    }

}

/* EXPORT */
module.exports = service;