// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @messaging

const TIMEOUTS = require('../../fixtures/timeouts');

describe('Message Reply', () => {
    let mainChannel;
    let otherChannel;
    let rootId;

    before(() => {
        // # Create main channel
        cy.apiInitSetup({loginAfter: true}).then(({team, channel}) => {
            mainChannel = channel;

            // # Create other channel
            cy.apiCreateChannel(team.id, 'other', 'other').then(({channel: newChannel}) => {
                otherChannel = newChannel;
            });

            // # Visit main channel
            cy.visit(`/${team.name}/channels/${channel.name}`);
        });
    });

    it('MM-T2132 - Message sends: just text', () => {
        // # Type `Hello` in center message box
        const msg = 'Hello';
        cy.get('#post_textbox').type(msg);

        // # Press `Enter`
        cy.get('#post_textbox').type('{enter}');

        // * Message displays in center
        cy.getLastPostId().then((postId) => {
            rootId = postId;
            cy.get(`#postMessageText_${postId}`).should('be.visible').and('have.text', msg);
        });
    });

    it('MM-T2134 - Reply to message displays in RHS and center and shows reply count', () => {
        // # Open RHS comment menu
        cy.clickPostCommentIcon(rootId);

        const msg = 'reply1';

        // # Type message and post reply
        cy.get('#reply_textbox').type(msg);

        // # Press `Enter`
        cy.get('#reply_textbox').type('{enter}');

        cy.getLastPostId().then((replyId) => {
            // * Message displays in center
            cy.get(`#post_${replyId}`).within(() => {
                cy.get(`#postMessageText_${replyId}`).should('be.visible').and('have.text', msg);
            });

            // * Message displays in RHS
            cy.get(`#rhsPost_${replyId}`).within(() => {
                cy.get(`#rhsPostMessageText_${replyId}`).should('be.visible').and('have.text', msg);
            });

            // * Reply count is visible and shows expected value
            cy.get(`#CENTER_commentIcon_${rootId} .post-menu__comment-count`).should('be.visible').and('have.text', '1');
        });

        // # Close RHS
        cy.uiCloseRHS();
    });

    it('MM-T2135 - Can open reply thread from reply count arrow and reply', () => {
        // # Click reply icon
        cy.get(`#CENTER_commentIcon_${rootId}`).click({force: true}).wait(TIMEOUTS.HALF_SEC);

        const msg = 'reply2';

        // # Type message
        cy.get('#reply_textbox').type(msg);

        // # Press `Enter`
        cy.get('#reply_textbox').type('{enter}');

        cy.getLastPostId().then((replyId) => {
            // * Message displays in center
            cy.get(`#post_${replyId}`).within(() => {
                cy.get(`#postMessageText_${replyId}`).should('be.visible').and('have.text', msg);
            });

            // * Message displays in RHS
            cy.get(`#rhsPost_${replyId}`).within(() => {
                cy.get(`#rhsPostMessageText_${replyId}`).should('be.visible').and('have.text', msg);
            });
        });

        // # Close RHS
        cy.uiCloseRHS();
    });

    it('MM-T2136 - Reply in RHS with different channel open in center', () => {
        // # Click on the `...` menu icon and click on `Reply`
        cy.uiClickPostDropdownMenu(rootId, 'Reply', 'CENTER');

        // # Switch to a different channel
        cy.get(`#sidebarItem_${otherChannel.name}`).click().wait(TIMEOUTS.FIVE_SEC);

        const msg = 'reply3';

        // # Type message
        cy.get('#reply_textbox').type(msg);

        // # Press `Enter`
        cy.get('#reply_textbox').type('{enter}');

        // * Center channel has not changed
        cy.get('#channelHeaderTitle').should('contain', otherChannel.display_name);

        // * Main channel is not unread
        cy.get(`#sidebarItem_${mainChannel.name}`).should('not.have.class', 'unread-title');

        // # Close RHS
        cy.uiCloseRHS();
    });
});
