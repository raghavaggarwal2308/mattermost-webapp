// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import classNames from 'classnames';
import {FormatLetterCaseIcon} from '@mattermost/compass-icons/components';
import {useIntl} from 'react-intl';

import Constants from 'utils/constants';
import KeyboardShortcutSequence, {KEYBOARD_SHORTCUTS} from 'components/keyboard_shortcuts/keyboard_shortcuts_sequence';
import OverlayTrigger from 'components/overlay_trigger';
import Tooltip from 'components/tooltip';

interface ToggleFormattingBarProps {
    onClick: React.MouseEventHandler;
    active: boolean;
}

export const ToggleFormattingBar = (props: ToggleFormattingBarProps): JSX.Element => {
    const {onClick, active} = props;
    const {formatMessage} = useIntl();
    const iconAriaLabel = formatMessage({id: 'generic_icons.format_letter_case', defaultMessage: 'Format letter Case Icon'});

    return (
        <OverlayTrigger
            delayShow={Constants.OVERLAY_TIME_DELAY}
            placement='top'
            trigger={['hover', 'focus']}
            overlay={<Tooltip id='toggleFormattingBarButtonTooltip'>
                <KeyboardShortcutSequence
                    shortcut={KEYBOARD_SHORTCUTS.msgShowFormatting}
                    hoistDescription={true}
                    isInsideTooltip={true}
                />
            </Tooltip>}
        >
            <button
                type='button'
                id='toggleFormattingBarButton'
                onClick={onClick}
                className={classNames('AdvancedTextEditor__action-button',
                    {'AdvancedTextEditor__action-button--active': active},
                )}
            >
                <FormatLetterCaseIcon
                    size={18}
                    color={'currentColor'}
                    aria-label={iconAriaLabel}
                />
            </button>
        </OverlayTrigger>
    );
};
