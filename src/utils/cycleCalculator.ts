import type { Cycle } from '../types/warframe';

/**
 * サイクルタイプ定義
 * - cetus: エイドロンの草原 (昼100分/夜50分 = 150分)
 * - vallis: オーブ峡谷 (寒冷20分/温暖6分40秒 = 26分40秒)
 * - cambion: カンビオン荒地 (Fass 100分/Vome 50分 = 150分)
 */
type CycleType = 'cetus' | 'vallis' | 'cambion';

/**
 * APIデータの有効期限が切れている場合、経過時間から現在のサイクルを計算して返す
 * 有効期限内の場合は、元のデータをそのまま返す
 *
 * @param cycle APIから取得したサイクルデータ
 * @param type サイクルの種類
 * @returns 現在の有効なサイクルデータ
 */
export const getEffectiveCycle = (cycle: Cycle | undefined, type: CycleType, offsetSeconds: number = 0): Cycle | undefined => {
  if (!cycle || !cycle.activation || !cycle.expiry) return cycle;

  const now = Date.now();

  // 1. 補正値(秒)を適用して、仮想的なexpiry/activationを算出する
  // offsetSecondsが正(例: +30)のとき、ユーザーは「あと30秒長く表示したい」と思っている
  // -> つまり、expiryは30秒後であってほしい
  // -> virtualExpiry = realExpiry + 30s
  // offsetSecondsが負(例: -30)のとき、ユーザーは「あと30秒短く表示したい」と思っている
  // -> つまり、expiryは30秒前であってほしい
  // -> virtualExpiry = realExpiry - 30s
  const offsetMs = offsetSeconds * 1000;
  let activationTime = new Date(cycle.activation).getTime() + offsetMs;
  let expiryTime = new Date(cycle.expiry).getTime() + offsetMs;

  // 定数定義 (Duration)
  let period1Duration: number; // Day/Cold/Fass
  let period2Duration: number; // Night/Warm/Vome
  let totalDuration: number;

  switch (type) {
    case 'cetus':
      period1Duration = 100 * 60 * 1000; // Day
      period2Duration = 50 * 60 * 1000;  // Night
      break;
    case 'vallis':
      period1Duration = 20 * 60 * 1000;  // Cold
      period2Duration = 400 * 1000;      // Warm (6m40s)
      break;
    case 'cambion':
      period1Duration = 100 * 60 * 1000; // Fass
      period2Duration = 50 * 60 * 1000;  // Vome
      break;
  }
  totalDuration = period1Duration + period2Duration;

  // 2. 補正適用後に、activation が未来になってしまった場合の処理 (巻き戻し)
  // 例: APIで「開始直後(残りFull)」のときに、offset=+10分 をすると activation が未来になる
  // この場合、現在は「前のサイクルの終わりのほう」であるべき
  if (activationTime > now) {
    while (activationTime > now) {
      let prevDuration = 0;
      let isCurrentStateState1 = false; // 今の(未来にある)状態がState1かどうか

      // 現在のstateを判定
      // Cetus: isDay=true -> State1
      // Vallis: state='cold' -> State1
      // Cambion: state='fass' -> State1
      if (type === 'cetus') isCurrentStateState1 = cycle.isDay;
      else if (type === 'vallis') isCurrentStateState1 = cycle.state === 'cold';
      else if (type === 'cambion') isCurrentStateState1 = cycle.state === 'fass';

      if (isCurrentStateState1) {
        // 今がState1 (Day/Cold) なら、前は State2 (Night/Warm)
        prevDuration = period2Duration;
      } else {
        // 今がState2 (Night/Warm) なら、前は State1 (Day/Cold)
        prevDuration = period1Duration;
      }

      // 時間を巻き戻す
      // expiry(今の終わり) は activation(今の始まり) になる
      expiryTime = activationTime;
      activationTime = expiryTime - prevDuration;

      // 状態を反転させる (State1 <-> State2)
      // ここでは元のcycleオブジェクトを書き換えるわけにいかないので、
      // ループを抜けた後に時刻から再判定するロジックにするか、仮想的なフラグを持つ
      // シンプルに時刻だけ巻き戻して、最後に「今の時刻」がサイクルのどこにあたるかで判定するのが確実
    }
  }

  // 3. 期限切れチェック (APIデータの有効期限が切れている、あるいは補正で過去になった場合の未来予測)
  if (expiryTime <= now) {
    while (expiryTime <= now) {
      // 次のサイクルへ進める
      let nextDuration = 0;
      // 単純に totalDuration 単位で進めるのではなく、State1 -> State2 の切り替えを考慮する必要があるが、
      // ここも「時刻」ベースで考える。
      // 現在の activation ~ expiry の期間は何の状態か？
      // それを知るには初期状態が必要...

      // ロジック簡略化:
      // activationTime を基準点(アンカー)として、 (now - activationTime) を計算し、
      // その経過時間が totalDuration の中でどこに位置するかを計算する方式に切り替える。
      // これならループも不要で高速かつ正確。

      // ただし、サイクルは非対称(100:50など)なので、単純な剰余計算はState1/State2の判定に注意が必要。
      // アンカーポイント: APIから取得した activationTime (補正済み) は「その状態が始まった瞬間」
      // これが過去であれば信頼できる。未来だった場合は上記で巻き戻しているので、必ず過去(or現在)にあるはず。
      break;
    }
  }

  // 再設計: アンカー方式
  // activationTime は「ある状態(StateX)が始まった時刻」。これは補正済み。
  // now - activationTime = 経過時間 (elapsed)
  // StateX が State1 なのか State2 なのかは cycle.state から分かる。

  // 初期状態(APIデータのstate)がState1かState2か
  let isApiState1 = false;
  if (type === 'cetus') isApiState1 = cycle.isDay;
  else if (type === 'vallis') isApiState1 = cycle.state === 'cold';
  else if (type === 'cambion') isApiState1 = cycle.state === 'fass';

  // 経過時間
  let elapsed = now - activationTime;

  // もし巻き戻しロジックで activationTime をいじった場合、Stateも反転している可能性があるため、
  // 上記のwhileループアプローチとアンカー方式を混ぜると危険。
  // むしろ、predictAsymmetricCycle のロジックをここに移植・統合するのがベスト。

  // -------------------------------------------------------------
  // 完全な再実装 (Settingsページのロジックをベースに統合)
  // -------------------------------------------------------------

  let currentActivation = new Date(cycle.activation).getTime() + offsetMs;
  let currentExpiry = new Date(cycle.expiry).getTime() + offsetMs;

  // State管理用変数
  let isDay = cycle.isDay;
  let state = cycle.state;

  // 1. 未来にある場合の巻き戻し (Nowより前になるまで)
  while (currentActivation > now) {
    // 前の状態に戻す
    let prevDuration = 0;

    // 現在の状態(未来にある状態)が何かによって、前の期間が決まる
    if (type === 'cetus') {
      if (isDay) { // Day(100) -> Prev is Night(50)
        isDay = false; state = 'night'; prevDuration = period2Duration;
      } else { // Night(50) -> Prev is Day(100)
        isDay = true; state = 'day'; prevDuration = period1Duration;
      }
    } else if (type === 'vallis') {
      if (state === 'warm') { // Warm(6m40) -> Prev is Cold(20m)
        state = 'cold'; prevDuration = period1Duration; // Cold is P1
      } else { // Cold(20m) -> Prev is Warm(6m40)
        state = 'warm'; prevDuration = period2Duration; // Warm is P2
      }
    } else if (type === 'cambion') {
      if (state === 'vome') { // Vome(50) -> Prev is Fass(100)
        state = 'fass'; prevDuration = period1Duration;
      } else { // Fass(100) -> Prev is Vome(50)
        state = 'vome'; prevDuration = period2Duration;
      }
    }

    currentExpiry = currentActivation;
    currentActivation = currentExpiry - prevDuration;
  }

  // 2. 過去にある場合の進行 (Nowより後になるまで)
  while (currentExpiry <= now) {
    let nextDuration = 0;

    if (type === 'cetus') {
      if (isDay) { // Day(100) -> Next is Night(50)
        isDay = false; state = 'night'; nextDuration = period2Duration;
      } else { // Night(50) -> Next is Day(100)
        isDay = true; state = 'day'; nextDuration = period1Duration;
      }
    } else if (type === 'vallis') {
      if (state === 'cold') { // Cold(20m) -> Next is Warm(6m40)
        state = 'warm'; nextDuration = period2Duration;
      } else { // Warm(6m40) -> Next is Cold(20m)
        state = 'cold'; nextDuration = period1Duration;
      }
    } else if (type === 'cambion') {
      if (state === 'fass') { // Fass(100) -> Next is Vome(50)
        state = 'vome'; nextDuration = period2Duration;
      } else { // Vome(50) -> Next is Fass(100)
        state = 'fass'; nextDuration = period1Duration;
      }
    }

    currentActivation = currentExpiry;
    currentExpiry = currentActivation + nextDuration;
  }

  return {
    ...cycle,
    activation: new Date(currentActivation).toISOString(),
    expiry: new Date(currentExpiry).toISOString(),
    state,
    isDay,
    timeLeft: 'Calculated' // UI側で再計算されるはずだが、予測値であることを示す
  };
};
