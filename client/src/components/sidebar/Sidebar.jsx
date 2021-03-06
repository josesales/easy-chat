import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Theme from '../theme/Theme';
import { SidebarStyles, RoomStyles, ButtonStyles, UserContainerStyles, UserNameStyles, UserListStyles } from './SidebarStyles';

const Sidebar = () => {

    const room = useSelector(state => state.roomReducer.room);

    let usersInRoom = null;

    const history = useHistory();

    if (room) {
        usersInRoom = room.users.map((user, index) => <li key={index}>{`${user.name}`}</li>);
    } else {
        return null;
    }

    const onLeaveClickHandler = () => {
        history.push('/login');
    }

    return (
        <SidebarStyles>

            <RoomStyles>
                <h2>{room.name}</h2>

                <Theme sidebar/>

                <ButtonStyles onClick={onLeaveClickHandler}>Leave</ButtonStyles>
            </RoomStyles>

            <UserContainerStyles>

                <UserNameStyles>Users</UserNameStyles>

                <UserListStyles>{usersInRoom}</UserListStyles>
            </UserContainerStyles>
        </SidebarStyles>
    );
}

export default Sidebar;