import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export const modalState = atom({
  key: 'modalStat',
  default: false
})