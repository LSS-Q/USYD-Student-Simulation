// Asset Index for Game Images
// Events
import eventStudyPressure from './events/event_study_pressure_1767678057040.png';
import eventPartTimeJob from './events/event_part_time_job_1767678074167.png';
import eventVisaExpires from './events/event_visa_expires_1767678178570.png';
import eventPrSuccess from './events/event_pr_success_1767678196162.png';

// New Phase 10 Images
import weekendBondi from './events/weekend_bondi_beach_1767679370124.png';
import weekendBlueMountains from './events/weekend_blue_mountains_1767679387092.png';
import weekendGaming from './events/weekend_home_gaming_1767679404860.png';
import weekendParty from './events/weekend_house_party_1767679421427.png';
import eventLecture from './events/event_lecture_hall_1767679440780.png';
import eventExamFail from './events/event_exam_fail_1767679461473.png';

// Player Avatars
import avatarPlayerMale from './avatars/avatar_player_male_1767678088897.png';
import avatarPlayerFemale from './avatars/avatar_player_female_1767678103419.png';

// NPC Avatars
import avatarProfChen from './avatars/avatar_npc_prof_chen_1767678129234.png';
import avatarAlice from './avatars/avatar_npc_alice_1767678145793.png';
import avatarJessica from './avatars/avatar_npc_jessica_1767678160567.png';
import avatarTutorDavid from './avatars/avatar_npc_tutor_david_1767683073617.png';
import avatarNerdZhang from './avatars/avatar_npc_nerd_zhang_1767683089442.png';
import avatarSlackerMike from './avatars/avatar_npc_slacker_mike_1767683105522.png';
import avatarPartyKevin from './avatars/avatar_npc_party_kevin_1767683122890.png';
import avatarGossipLinda from './avatars/avatar_npc_gossip_linda_1767683139476.png';
import avatarGymAlex from './avatars/avatar_npc_gym_alex_1767683159688.png';

export const EVENT_IMAGES: Record<string, string> = {
    'study_pressure': eventStudyPressure,
    'part_time_job': eventPartTimeJob,
    'visa_expires': eventVisaExpires,
    'pr_success': eventPrSuccess,

    // New
    'weekend_bondi': weekendBondi,
    'weekend_hiking': weekendBlueMountains,
    'weekend_gaming': weekendGaming,
    'weekend_party': weekendParty,
    'lecture_hall': eventLecture,
    'exam_fail': eventExamFail,
};

export const PLAYER_AVATARS: Record<string, string> = {
    'male': avatarPlayerMale,
    'female': avatarPlayerFemale,
};

export const NPC_AVATARS: Record<string, string> = {
    'prof_chen': avatarProfChen,
    'rich_alice': avatarAlice,
    'crush_jessica': avatarJessica,
    'tutor_david': avatarTutorDavid,
    'nerd_zhang': avatarNerdZhang,
    'slacker_mike': avatarSlackerMike,
    'party_king_kevin': avatarPartyKevin,
    'gossip_linda': avatarGossipLinda,
    'gym_bro_alex': avatarGymAlex,
};
