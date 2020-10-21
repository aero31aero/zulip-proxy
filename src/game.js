let player_seq = 100;

exports.init_session = (user) => {
    player_seq += 1;

    return {
        player_id: player_seq,
        user: user,
    };
};
