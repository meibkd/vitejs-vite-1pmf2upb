import React, { useState, useEffect, useRef } from 'react';

// 您專屬的 Google Apps Script 部署網址
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyTCsUbrLH182tS2w26iohE0QtMZybwYxJDEEhhN4xWx1UOexPkUMHcxm5m4Q3PlJi8/exec';

// 皮克敏品種圖鑑
const PIKMIN_CATALOG = {
  red: {
    name: '紅皮克敏',
    body: '🍎',
    colorHex: '#ef4444',
    bgHex: '#fef2f2',
    decor: '☕ 咖啡杯飾品',
    trait: '耐火・充滿熱情',
  },
  blue: {
    name: '藍皮克敏',
    body: '🫐',
    colorHex: '#3b82f6',
    bgHex: '#eff6ff',
    decor: '🎓 博士帽飾品',
    trait: '親水・冷靜聰明',
  },
  yellow: {
    name: '黃皮克敏',
    body: '🍋',
    colorHex: '#eab308',
    bgHex: '#fefce8',
    decor: '🎧 電競耳機飾品',
    trait: '導電・跳得最高',
  },
  purple: {
    name: '紫皮克敏',
    body: '🍇',
    colorHex: '#a855f7',
    bgHex: '#faf5ff',
    decor: '🏋️ 大力啞鈴飾品',
    trait: '十倍力氣・超可靠',
  },
  white: {
    name: '白皮克敏',
    body: '🧄',
    colorHex: '#64748b',
    bgHex: '#f8fafc',
    decor: '♨️ 溫泉毛巾飾品',
    trait: '紅眼睛・跑得最快',
  },
  pink: {
    name: '羽翅皮克敏',
    body: '🍑',
    colorHex: '#ec4899',
    bgHex: '#fdf2f8',
    decor: '✈️ 小飛機飾品',
    trait: '會飛・浪漫自由',
  },
  ice: {
    name: '冰凍皮克敏',
    body: '🧊',
    colorHex: '#06b6d4',
    bgHex: '#ecfeff',
    decor: '🍧 彩虹刨冰飾品',
    trait: '冰晶・清爽專注',
  },
  rock: {
    name: '岩石皮克敏',
    body: '🪨',
    colorHex: '#57534e',
    bgHex: '#f5f5f4',
    decor: '💎 水晶礦石飾品',
    trait: '堅硬・毅力滿分',
  },
};

// 7.1 產生初始狀態（包含爸比與獎學金欄位）
const createCleanState = () => ({
  version: '7.1',
  adminPin: '8888',
  familyGoal: {
    title: '♨️ 週末全家放鬆小旅行 / 吃大餐',
    targetScore: 1000,
    currentScore: 0,
    createdAt: '週日家庭會議設定',
    contributions: { mom: 0, dad: 0, kid1: 0, kid2: 0, kid3: 0 },
    history: [],
  },
  profiles: [
    {
      id: 'mom',
      role: '媽媽 (管理者)',
      avatar: '👩‍🏫',
      isSetup: false,
      name: '',
      score: 0,
      nectar: 50,
      pikmin: null,
      squad: [],
      tasks: [
        {
          id: 't_demo_1',
          title: '✨ 範例任務：完成今日第一項計畫',
          points: 25,
          exp: 50,
          completed: false,
        },
      ],
      tomorrowChallenges: [],
      musicUrl: '',
      scholarshipPending: 0,
      academicRecords: [],
      eduLevel: null,
    },
    {
      id: 'dad',
      role: '爸比',
      avatar: '👨',
      isSetup: false,
      name: '',
      score: 0,
      nectar: 50,
      pikmin: null,
      squad: [],
      tasks: [
        {
          id: 't_demo_dad',
          title: '✨ 範例任務：幫忙洗碗或倒垃圾',
          points: 25,
          exp: 50,
          completed: false,
        },
      ],
      tomorrowChallenges: [],
      musicUrl: '',
      scholarshipPending: 0,
      academicRecords: [],
      eduLevel: null,
    },
    {
      id: 'kid1',
      role: '大姐',
      avatar: '👧',
      isSetup: false,
      name: '',
      score: 0,
      nectar: 50,
      pikmin: null,
      squad: [],
      tasks: [
        {
          id: 't_demo_2',
          title: '✨ 範例任務：完成今日學校作業',
          points: 25,
          exp: 50,
          completed: false,
        },
      ],
      tomorrowChallenges: [],
      musicUrl: '',
      scholarshipPending: 0,
      academicRecords: [],
      eduLevel: 'senior',
    },
    {
      id: 'kid2',
      role: '二姐',
      avatar: '👧',
      isSetup: false,
      name: '',
      score: 0,
      nectar: 50,
      pikmin: null,
      squad: [],
      tasks: [
        {
          id: 't_demo_3',
          title: '✨ 範例任務：完成今日學校作業',
          points: 25,
          exp: 50,
          completed: false,
        },
      ],
      tomorrowChallenges: [],
      musicUrl: '',
      scholarshipPending: 0,
      academicRecords: [],
      eduLevel: 'junior',
    },
    {
      id: 'kid3',
      role: '小妹',
      avatar: '👧',
      isSetup: false,
      name: '',
      score: 0,
      nectar: 50,
      pikmin: null,
      squad: [],
      tasks: [
        {
          id: 't_demo_4',
          title: '✨ 範例任務：完成今日學校作業',
          points: 25,
          exp: 50,
          completed: false,
        },
      ],
      tomorrowChallenges: [],
      musicUrl: '',
      scholarshipPending: 0,
      academicRecords: [],
      eduLevel: 'junior',
    },
  ],
  rewards: [
    { id: 'r1', title: '🧹 免做家事特權券乙張', cost: 150 },
    { id: 'r2', title: '🎮 假日休閒娛樂時間 +1 小時', cost: 200 },
    { id: 'r3', title: '🍲 週末指定全家人吃喜歡的餐廳', cost: 350 },
    { id: 'r4', title: '🎁 文具 / 書籍 / 零用錢獎勵 $100', cost: 400 },
  ],
  redemptionRequests: [],
});

// --- 獎學金計算邏輯 ---
const calculateReward = (eduLevel, type, score, improve = 0, regress = 0) => {
  let money = 0;
  if (eduLevel === 'junior') {
    if (type === 'daily') {
      if (score >= 95) money = 50;
      else if (score >= 90) money = 25;
      else if (score >= 70) money = 0;
      else money = -10;
    } else {
      if (score >= 100) money = 500;
      else if (score >= 95) money = 400;
      else if (score >= 90) money = 300;
      else if (score >= 85) money = 200;
      else if (score >= 80) money = 100;
      else if (score >= 70) money = 50;
      else if (score >= 60) money = -100;
      else if (score >= 50) money = -150;
      else money = -200;
    }
  } else if (eduLevel === 'senior') {
    if (type === 'daily') {
      if (score >= 90) money = 50;
      else if (score >= 80) money = 25;
      else if (score >= 70) money = 0;
      else money = -10;
    } else {
      if (score >= 100) money = 600;
      else if (score >= 95) money = 500;
      else if (score >= 90) money = 400;
      else if (score >= 85) money = 300;
      else if (score >= 80) money = 200;
      else if (score >= 70) money = 100;
      else if (score >= 65) money = 50;
      else if (score >= 50) money = -100;
      else money = -150;
    }
  }
  if (type === 'monthly') {
    money += improve * 3;
    money -= regress * 1;
  }
  return money;
};

export default function App() {
  const [state, setState] = useState(createCleanState);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeProfileId, setActiveProfileId] = useState('mom');
  const [activeTab, setActiveTab] = useState('tasks');

  // 管理者狀態
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [grantTargetId, setGrantTargetId] = useState('kid1');
  const [grantPoints, setGrantPoints] = useState(50);
  const [grantReason, setGrantReason] = useState('');
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(200);

  // 獎學金表單狀態
  const [scoreSubject, setScoreSubject] = useState('');
  const [scoreType, setScoreType] = useState('daily');
  const [scoreValue, setScoreValue] = useState(100);
  const [improveRank, setImproveRank] = useState('');
  const [regressRank, setRegressRank] = useState('');

  // 目標表單
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalTitleInput, setGoalTitleInput] = useState('');
  const [goalTargetInput, setGoalTargetInput] = useState(1000);
  const [resetCurrentProgress, setResetCurrentProgress] = useState(false);

  // 皮克敏
  const [showHatchModal, setShowHatchModal] = useState(false);
  const [hatchColor, setHatchColor] = useState('pink');
  const [hatchNickname, setHatchNickname] = useState('');

  // 任務/首次登入/番茄鐘
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(25);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeStake, setNewChallengeStake] = useState(50);
  const [setupName, setSetupName] = useState('');
  const [setupPikminColor, setSetupPikminColor] = useState('red');
  const [setupPikminNickname, setSetupPikminNickname] = useState('');

  const [pomoMinutes] = useState(50);
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [notice, setNotice] = useState(null);

  const activeProfile =
    state.profiles.find((p) => p.id === activeProfileId) || state.profiles[0];
  const familyGoal = state.familyGoal || createCleanState().familyGoal;
  const isSunday = new Date().getDay() === 0;

  const showNotice = (title, message) => {
    setNotice({ title, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // 雲端同步 (支援資料結構升級與防呆)
  const fetchFromCloud = () => {
    setSyncStatus('syncing');
    fetch(`${GAS_URL}?t=${Date.now()}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'success' && result.data) {
          const defaultClean = createCleanState();
          const loadedProfiles = result.data.profiles || defaultClean.profiles;

          let upgradedProfiles = loadedProfiles.map((p) => ({
            ...p,
            scholarshipPending: p.scholarshipPending || 0,
            academicRecords: p.academicRecords || [],
            eduLevel:
              p.eduLevel ||
              (p.id === 'kid1'
                ? 'senior'
                : p.id === 'kid2' || p.id === 'kid3'
                ? 'junior'
                : null),
            nectar:
              typeof p.nectar === 'number' ? p.nectar : p.pikmin?.exp || 50,
            squad: Array.isArray(p.squad) ? p.squad : [],
            pikmin: p.pikmin
              ? {
                  ...p.pikmin,
                  stage:
                    typeof p.pikmin.stage === 'number'
                      ? p.pikmin.stage
                      : !p.pikmin.isPlucked
                      ? 0
                      : Math.min(4, Math.floor((p.pikmin.exp || 0) / 100) + 1),
                }
              : null,
          }));

          // 如果舊資料沒有爸比，強制加入
          if (!upgradedProfiles.find((p) => p.id === 'dad')) {
            const defaultDad = defaultClean.profiles.find(
              (p) => p.id === 'dad'
            );
            if (defaultDad) upgradedProfiles.splice(1, 0, defaultDad);
          }

          const loadedData = {
            ...defaultClean,
            ...result.data,
            version: '7.1',
            profiles: upgradedProfiles,
            familyGoal: {
              ...defaultClean.familyGoal,
              ...(result.data.familyGoal || {}),
              contributions: {
                ...defaultClean.familyGoal.contributions,
                ...(result.data.familyGoal?.contributions || {}),
              },
            },
          };
          setState(loadedData);
          setSyncStatus('success');
        } else {
          const clean = createCleanState();
          setState(clean);
          syncToCloud(clean);
        }
        setIsInitializing(false);
      })
      .catch((err) => {
        console.error('讀取失敗:', err);
        setSyncStatus('idle');
        setIsInitializing(false);
      });
  };

  useEffect(() => {
    fetchFromCloud();
  }, []);

  const syncToCloud = (newState, logEntry = null) => {
    setSyncStatus('syncing');
    fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ appState: newState, logEntry: logEntry }),
    })
      .then(() => {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2500);
      })
      .catch(() => setSyncStatus('error'));
  };

  const updateProfileState = (
    updater,
    logEntry = null,
    targetId = activeProfileId,
    familyScoreDelta = 0
  ) => {
    setState((prevState) => {
      const newProfiles = prevState.profiles.map((p) =>
        p.id === targetId ? updater(p) : p
      );
      let newFamilyGoal = prevState.familyGoal || createCleanState().familyGoal;
      if (familyScoreDelta !== 0) {
        const currentContrib = newFamilyGoal.contributions?.[targetId] || 0;
        newFamilyGoal = {
          ...newFamilyGoal,
          currentScore: Math.max(
            0,
            (newFamilyGoal.currentScore || 0) + familyScoreDelta
          ),
          contributions: {
            ...(newFamilyGoal.contributions || {}),
            [targetId]: Math.max(0, currentContrib + familyScoreDelta),
          },
        };
      }
      const newState = {
        ...prevState,
        profiles: newProfiles,
        familyGoal: newFamilyGoal,
      };
      syncToCloud(newState, logEntry);
      return newState;
    });
  };

  // --- 獎學金與成績功能 ---
  const handleAddScore = (e) => {
    e.preventDefault();
    if (!scoreSubject.trim()) return;
    const scoreNum = Number(scoreValue);
    const imp = Number(improveRank) || 0;
    const reg = Number(regressRank) || 0;

    const reward = calculateReward(
      activeProfile.eduLevel,
      scoreType,
      scoreNum,
      imp,
      reg
    );

    updateProfileState(
      (p) => ({
        ...p,
        scholarshipPending: (p.scholarshipPending || 0) + reward,
        academicRecords: [
          {
            id: `ar_${Date.now()}`,
            date: new Date().toLocaleDateString('zh-TW', {
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            subject: scoreSubject.trim(),
            type: scoreType,
            score: scoreNum,
            reward: reward,
          },
          ...(p.academicRecords || []),
        ],
      }),
      {
        memberName: activeProfile.name || activeProfile.role,
        actionType: '📝 登記成績',
        title: `${scoreSubject} (${scoreNum}分)`,
        scoreDelta: 0,
        expDelta: 0,
      }
    );

    setScoreSubject('');
    setScoreValue(100);
    setImproveRank('');
    setRegressRank('');
    showNotice('✅ 成績已登記！', `本次換算獎學金 ${reward} 元！`);
  };

  const handleSettleScholarship = (targetId) => {
    if (!isAdminUnlocked) return;
    const target = state.profiles.find((p) => p.id === targetId);
    if (!target || target.scholarshipPending === 0) return;

    if (
      !window.confirm(
        `確定要結算發放【${target.name || target.role}】的零用錢 $${
          target.scholarshipPending
        } 嗎？\n(按下確定後，將歸零重新計算)`
      )
    )
      return;

    updateProfileState(
      (p) => ({
        ...p,
        scholarshipPending: 0,
        academicRecords: [
          {
            id: `ar_${Date.now()}`,
            date: new Date().toLocaleDateString('zh-TW'),
            subject: '💰 管理者結算發放',
            type: 'settle',
            score: '-',
            reward: -p.scholarshipPending, // 僅為沖銷顯示
          },
          ...(p.academicRecords || []),
        ],
      }),
      {
        memberName: '管理者',
        actionType: '💰 結算零用錢',
        title: `結算 ${target.name || target.role} 獎學金`,
        scoreDelta: 0,
        expDelta: 0,
      },
      targetId
    );
    showNotice(
      '✅ 結算完成！',
      `已將 ${target.name || target.role} 的獎學金歸零。`
    );
  };

  // 皮克敏養成機制
  const FEED_COST = 25;
  const HATCH_COST = 80;

  const handleFeedPikmin = () => {
    const pk = activeProfile.pikmin;
    if (!pk) return;
    const currentStage = pk.stage || 0;
    if (currentStage >= 4) {
      showNotice('👑 已經最高等級！', '快培育新花苗吧！');
      return;
    }
    if ((activeProfile.nectar || 0) < FEED_COST) {
      alert('💧 精華不足！');
      return;
    }

    const nextStage = currentStage + 1;
    updateProfileState(
      (p) => ({
        ...p,
        nectar: p.nectar - FEED_COST,
        pikmin: {
          ...p.pikmin,
          stage: nextStage,
          isPlucked: nextStage >= 1,
          exp: p.pikmin.exp + FEED_COST,
        },
      }),
      {
        memberName: activeProfile.name || activeProfile.role,
        actionType: '💧 餵食精華',
        title: `${pk.nickname} 升級`,
        scoreDelta: 0,
        expDelta: -FEED_COST,
      }
    );
  };

  const handleConfirmHatchNewPikmin = (e) => {
    e.preventDefault();
    if (!hatchNickname.trim()) return;
    const pk = activeProfile.pikmin;
    const cost = pk && (pk.stage || 0) >= 4 ? 0 : HATCH_COST;
    if ((activeProfile.nectar || 0) < cost) {
      alert('精華不足！');
      return;
    }

    updateProfileState(
      (p) => {
        const graduated = p.pikmin
          ? {
              id: `sq_${Date.now()}`,
              nickname: p.pikmin.nickname,
              color: p.pikmin.color,
              stage: p.pikmin.stage || 1,
            }
          : null;
        return {
          ...p,
          nectar: p.nectar - cost,
          squad: graduated ? [...(p.squad || []), graduated] : p.squad || [],
          pikmin: {
            color: hatchColor,
            stage: 0,
            isPlucked: false,
            exp: 0,
            nickname: hatchNickname.trim(),
          },
        };
      },
      {
        memberName: activeProfile.name || activeProfile.role,
        actionType: '🛸 培育新花苗',
        title: hatchNickname.trim(),
        scoreDelta: 0,
        expDelta: -cost,
      }
    );
    setShowHatchModal(false);
  };

  const handleResetScoresOnly = () => {
    if (
      !isAdminUnlocked ||
      !window.confirm(
        '確定要將所有人的「兌換積分」歸零嗎？\n✅ (零用錢、寵物與精華會保留)'
      )
    )
      return;
    setState((prev) => {
      const nextProfiles = prev.profiles.map((p) => ({ ...p, score: 0 }));
      const nextState = {
        ...prev,
        profiles: nextProfiles,
        redemptionRequests: [],
      };
      syncToCloud(nextState);
      return nextState;
    });
  };

  // 家庭目標與管理
  const handleSaveFamilyGoal = (e) => {
    e.preventDefault();
    if (!isAdminUnlocked || !goalTitleInput.trim()) return;
    setState((prev) => {
      const prevGoal = prev.familyGoal || createCleanState().familyGoal;
      const updatedGoal = {
        ...prevGoal,
        title: goalTitleInput.trim(),
        targetScore: Number(goalTargetInput),
        currentScore: resetCurrentProgress ? 0 : prevGoal.currentScore,
        contributions: resetCurrentProgress
          ? { mom: 0, dad: 0, kid1: 0, kid2: 0, kid3: 0 }
          : prevGoal.contributions,
      };
      const nextState = { ...prev, familyGoal: updatedGoal };
      syncToCloud(nextState);
      return nextState;
    });
    setShowGoalEditor(false);
  };

  const handleArchiveCompletedGoal = () => {
    if (!isAdminUnlocked) return;
    const nextGoalTitle = window.prompt(
      `🎉 恭喜達成！請輸入新目標名稱：`,
      '🏕️ 下一次全家旅行'
    );
    if (!nextGoalTitle) return;
    setState((prev) => {
      const prevGoal = prev.familyGoal || createCleanState().familyGoal;
      const archivedItem = {
        id: `fg_${Date.now()}`,
        title: prevGoal.title,
        score: prevGoal.currentScore,
        target: prevGoal.targetScore,
      };
      const nextGoal = {
        title: nextGoalTitle.trim(),
        targetScore: prevGoal.targetScore,
        currentScore: 0,
        contributions: { mom: 0, dad: 0, kid1: 0, kid2: 0, kid3: 0 },
        history: [archivedItem, ...(prevGoal.history || [])],
      };
      const nextState = { ...prev, familyGoal: nextGoal };
      syncToCloud(nextState);
      return nextState;
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (pinInput === (state.adminPin || '8888')) {
      setIsAdminUnlocked(true);
      setShowPinModal(false);
      setPinInput('');
      showNotice('👑 解鎖成功', '管理者模式已啟動');
    } else {
      alert('❌ 密碼錯誤！');
    }
  };

  const handleAdminGrantScore = (e) => {
    e.preventDefault();
    if (!isAdminUnlocked) return;
    const pts = Number(grantPoints);
    const nectarBonus = Math.max(0, pts);
    updateProfileState(
      (p) => ({
        ...p,
        score: Math.max(0, p.score + pts),
        nectar: Math.max(0, (p.nectar || 0) + nectarBonus),
      }),
      {
        memberName: '指定成員',
        actionType: '👑 調整積分',
        title: grantReason.trim() || '特別嘉獎',
        scoreDelta: pts,
        expDelta: nectarBonus,
      },
      grantTargetId,
      pts > 0 ? pts : 0
    );
    setGrantReason('');
  };

  // 任務與設定
  const handleCompleteSetup = (e) => {
    e.preventDefault();
    if (!setupName.trim() || !setupPikminNickname.trim()) return;
    updateProfileState(
      (p) => ({
        ...p,
        isSetup: true,
        name: setupName.trim(),
        score: 0,
        nectar: 50,
        pikmin: {
          color: setupPikminColor,
          stage: 0,
          isPlucked: false,
          exp: 0,
          nickname: setupPikminNickname.trim(),
        },
      }),
      {
        memberName: setupName.trim(),
        actionType: '🎉 首次登入',
        title: `領養 ${setupPikminNickname.trim()}`,
        scoreDelta: 0,
        expDelta: 50,
      }
    );
  };

  const handleToggleTask = (task) => {
    const isNowCompleted = !task.completed;
    const scoreDelta = isNowCompleted ? task.points : -task.points;
    const nectarDelta = isNowCompleted ? task.exp : -task.exp;
    updateProfileState(
      (p) => ({
        ...p,
        tasks: p.tasks.map((t) =>
          t.id === task.id ? { ...t, completed: isNowCompleted } : t
        ),
        score: Math.max(0, p.score + scoreDelta),
        nectar: Math.max(0, (p.nectar || 0) + nectarDelta),
      }),
      {
        memberName: activeProfile.name || activeProfile.role,
        actionType: isNowCompleted ? '✅ 完成任務' : '↩️ 取消任務',
        title: task.title,
        scoreDelta,
        expDelta: nectarDelta,
      },
      activeProfileId,
      scoreDelta
    );
  };

  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          updateProfileState(
            (p) => ({
              ...p,
              score: p.score + 80,
              nectar: (p.nectar || 0) + 150,
            }),
            {
              memberName: activeProfile.name || activeProfile.role,
              actionType: `🍓 番茄鐘`,
              title: '專注完成',
              scoreDelta: 80,
              expDelta: 150,
            },
            activeProfileId,
            80
          );
          showNotice('🎉 專注完成！', `獲得 +80 積分與 +150 滴精華！`);
          return pomoMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, pomoMinutes, activeProfileId]);

  const getPikminVisual = (pk) => {
    if (!pk)
      return {
        emoji: '🌱',
        headIcon: '',
        stageName: '未領養',
        hearts: '🤍🤍🤍🤍',
        info: PIKMIN_CATALOG.red,
        stage: 0,
      };
    const info = PIKMIN_CATALOG[pk.color] || PIKMIN_CATALOG.red;
    const stg = typeof pk.stage === 'number' ? pk.stage : 0;
    if (stg === 0)
      return {
        emoji: '🪴',
        headIcon: '🌱',
        stageName: `盆栽花苗`,
        hearts: '🤍🤍🤍🤍',
        info,
        stage: 0,
        nextAction: '💧 澆水拔出花苗',
      };
    if (stg === 1)
      return {
        emoji: info.body,
        headIcon: '🌿',
        stageName: `綠葉`,
        hearts: '❤️🤍🤍🤍',
        info,
        stage: 1,
        nextAction: '💧 長出花苞',
      };
    if (stg === 2)
      return {
        emoji: info.body,
        headIcon: '🌷',
        stageName: `花苞`,
        hearts: '❤️❤️🤍🤍',
        info,
        stage: 2,
        nextAction: '💧 盛開鮮花',
      };
    if (stg === 3)
      return {
        emoji: info.body,
        headIcon: '🌸',
        stageName: `開花`,
        hearts: '❤️❤️❤️🤍',
        info,
        stage: 3,
        nextAction: '💧 穿戴飾品',
      };
    return {
      emoji: info.body,
      headIcon: `🌸`,
      stageName: `👑 ${info.decor}`,
      hearts: '💛💛💛💛',
      info,
      stage: 4,
      nextAction: '👑 滿級！',
    };
  };

  if (isInitializing)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#15803d',
          fontWeight: 'bold',
        }}
      >
        📡 同步資料中...
      </div>
    );

  const pkVisual = getPikminVisual(activeProfile.pikmin);
  const familyProgressPct = Math.min(
    100,
    Math.round(
      ((familyGoal.currentScore || 0) / (familyGoal.targetScore || 1000)) * 100
    )
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0fdf4',
        color: '#1e293b',
        padding: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          maxWidth: '960px',
          margin: '0 auto 16px auto',
          backgroundColor: 'white',
          padding: '16px 20px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#15803d',
              margin: 0,
            }}
          >
            🌱 皮克敏家庭任務花園
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: '#16a34a',
                backgroundColor: '#f0fdf4',
                padding: '6px 12px',
                borderRadius: '999px',
                fontWeight: 'bold',
              }}
            >
              {syncStatus === 'syncing' ? '🔄 同步中' : '☁️ 已連線'}
            </span>
            {!isAdminUnlocked ? (
              <button
                onClick={() => setShowPinModal(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ddd6fe',
                  backgroundColor: '#f5f3ff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#6d28d9',
                }}
              >
                🔐 管理者登入
              </button>
            ) : (
              <button
                onClick={() => setIsAdminUnlocked(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#7c3aed',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                👑 退出管理
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {state.profiles.map((p) => {
            const isSelected = activeProfileId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProfileId(p.id);
                  setSetupName(p.name || '');
                  setSetupPikminNickname(p.pikmin?.nickname || '');
                }}
                style={{
                  flex: '1 1 120px',
                  padding: '8px 6px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  border: isSelected
                    ? '2px solid #16a34a'
                    : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#16a34a' : '#f8fafc',
                  color: isSelected ? 'white' : '#334155',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{p.avatar}</span>{' '}
                  <span>{p.isSetup ? p.name : `${p.role}`}</span>
                </div>
                {p.isSetup && (
                  <div
                    style={{
                      fontSize: '11px',
                      backgroundColor: isSelected
                        ? 'rgba(255,255,255,0.2)'
                        : '#fef3c7',
                      color: isSelected ? 'white' : '#b45309',
                      padding: '2px 6px',
                      borderRadius: '999px',
                    }}
                  >
                    ✨{p.score} | 💧{p.nectar || 0}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {isAdminUnlocked && (
        <section
          style={{
            maxWidth: '960px',
            margin: '0 auto 16px auto',
            backgroundColor: '#faf5ff',
            border: '2px solid #d8b4fe',
            borderRadius: '20px',
            padding: '16px',
          }}
        >
          <h3
            style={{ margin: '0 0 12px 0', color: '#6b21a8', fontSize: '16px' }}
          >
            👑 管理者快速派獎
          </h3>
          <form
            onSubmit={handleAdminGrantScore}
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <select
              value={grantTargetId}
              onChange={(e) => setGrantTargetId(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
              }}
            >
              {state.profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatar} {p.name || p.role}
                </option>
              ))}
            </select>
            <select
              value={grantPoints}
              onChange={(e) => setGrantPoints(Number(e.target.value))}
              style={{
                padding: '8px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
              }}
            >
              <option value={25}>+25 分/精華</option>
              <option value={50}>+50 分/精華</option>
              <option value={100}>+100 分/精華</option>
              <option value={-30}>-30 扣分</option>
            </select>
            <button
              type="submit"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 'bold',
                border: 'none',
              }}
            >
              🎁 派發
            </button>
          </form>
        </section>
      )}

      <main style={{ maxWidth: '960px', margin: '0 auto' }}>
        {!activeProfile.isSetup ? (
          <div
            style={{
              backgroundColor: 'white',
              padding: '32px 24px',
              borderRadius: '24px',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                color: '#15803d',
                textAlign: 'center',
              }}
            >
              歡迎首次登入！
            </h2>
            <form
              onSubmit={handleCompleteSetup}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <input
                required
                type="text"
                placeholder="設定暱稱"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                }}
              >
                {Object.entries(PIKMIN_CATALOG).map(([key, info]) => (
                  <div
                    key={key}
                    onClick={() => setSetupPikminColor(key)}
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border:
                        setupPikminColor === key
                          ? '2px solid #16a34a'
                          : '1px solid #e2e8f0',
                      backgroundColor:
                        setupPikminColor === key ? '#dcfce7' : '#f8fafc',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>{info.body}</div>
                  </div>
                ))}
              </div>
              <input
                required
                type="text"
                placeholder="皮克敏取名"
                value={setupPikminNickname}
                onChange={(e) => setSetupPikminNickname(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                }}
              >
                開始（送 50 滴精華）
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                  }}
                >
                  ✨ {activeProfile.score} 分
                </span>
                <span
                  style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                  }}
                >
                  💧 {activeProfile.nectar || 0} 滴
                </span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: pkVisual.info.colorHex,
                  }}
                >
                  {pkVisual.info.name}
                </div>
                <h2
                  style={{
                    fontSize: '22px',
                    color: '#15803d',
                    margin: '4px 0',
                  }}
                >
                  {activeProfile.pikmin.nickname}
                </h2>
                <div style={{ fontSize: '14px', letterSpacing: '2px' }}>
                  {pkVisual.hearts}
                </div>
              </div>
              <div
                onClick={handleFeedPikmin}
                style={{
                  width: '160px',
                  height: '160px',
                  margin: '0 auto 16px auto',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, #ffffff 0%, ${pkVisual.info.bgHex} 70%, #dcfce7 100%)`,
                  border: `4px solid ${
                    pkVisual.stage >= 4 ? '#f59e0b' : '#bbf7d0'
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '-4px' }}>
                  {pkVisual.headIcon}
                </div>
                <div style={{ fontSize: '60px' }}>{pkVisual.emoji}</div>
              </div>
              <div
                style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                <button
                  onClick={handleFeedPikmin}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    background:
                      (activeProfile.nectar || 0) >= FEED_COST
                        ? 'linear-gradient(90deg, #0284c7, #16a34a)'
                        : '#e2e8f0',
                    color:
                      (activeProfile.nectar || 0) >= FEED_COST
                        ? 'white'
                        : '#64748b',
                  }}
                >
                  {pkVisual.nextAction}
                </button>
                <button
                  onClick={() => setShowHatchModal(true)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px dashed #86efac',
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                  }}
                >
                  🛸 培育新花苗
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { id: 'tasks', label: '📝 任務' },
                  { id: 'pomodoro', label: '🍓 番茄' },
                  { id: 'shop', label: '🎁 商店' },
                  { id: 'academic', label: '📚 獎學金' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: '1 1 70px',
                      padding: '12px 4px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      border: 'none',
                      borderBottom:
                        activeTab === tab.id
                          ? '3px solid #16a34a'
                          : '3px solid transparent',
                      backgroundColor:
                        activeTab === tab.id ? 'white' : 'transparent',
                      color: activeTab === tab.id ? '#15803d' : '#64748b',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '20px', flex: 1 }}>
                {activeTab === 'tasks' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {activeProfile.tasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: t.completed ? '#f8fafc' : 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '22px', marginRight: '12px' }}>
                          {t.completed ? '✅' : '⬜'}
                        </span>
                        <span
                          style={{
                            flex: 1,
                            textDecoration: t.completed
                              ? 'line-through'
                              : 'none',
                            fontWeight: 'bold',
                            color: t.completed ? '#94a3b8' : '#1e293b',
                          }}
                        >
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'academic' && (
                  <div>
                    {activeProfile.id === 'mom' ||
                    activeProfile.id === 'dad' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a' }}>
                          👑 孩子零用錢待結算清單
                        </h3>
                        {state.profiles
                          .filter((p) => p.eduLevel)
                          .map((kid) => (
                            <div
                              key={kid.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#f8fafc',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>
                                  {kid.avatar}
                                </span>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>
                                    {kid.name || kid.role}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: '#64748b',
                                    }}
                                  >
                                    {kid.eduLevel === 'senior'
                                      ? '高中'
                                      : '國中'}
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: '900',
                                    fontSize: '20px',
                                    color: '#b45309',
                                  }}
                                >
                                  ${kid.scholarshipPending || 0}
                                </div>
                                {isAdminUnlocked &&
                                  kid.scholarshipPending !== 0 && (
                                    <button
                                      onClick={() =>
                                        handleSettleScholarship(kid.id)
                                      }
                                      style={{
                                        backgroundColor: '#16a34a',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      ✅ 結算
                                    </button>
                                  )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            backgroundColor: '#fffbeb',
                            border: '2px solid #fcd34d',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '20px',
                          }}
                        >
                          <h3
                            style={{ margin: '0 0 12px 0', color: '#b45309' }}
                          >
                            💰 待發零用錢：
                            <span style={{ fontSize: '24px' }}>
                              ${activeProfile.scholarshipPending || 0}
                            </span>
                          </h3>
                          <form
                            onSubmit={handleAddScore}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <select
                                value={scoreType}
                                onChange={(e) => setScoreType(e.target.value)}
                                style={{
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                }}
                              >
                                <option value="daily">平時小考</option>
                                <option value="monthly">月考段考</option>
                              </select>
                              <input
                                required
                                type="text"
                                placeholder="科目"
                                value={scoreSubject}
                                onChange={(e) =>
                                  setScoreSubject(e.target.value)
                                }
                                style={{
                                  flex: 1,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                }}
                              />
                              <input
                                required
                                type="number"
                                placeholder="分數"
                                value={scoreValue}
                                onChange={(e) =>
                                  setScoreValue(Number(e.target.value))
                                }
                                style={{
                                  width: '70px',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                }}
                              />
                            </div>
                            {scoreType === 'monthly' && (
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '8px',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <input
                                  type="number"
                                  placeholder="進步名次 (無則免填)"
                                  value={improveRank}
                                  onChange={(e) =>
                                    setImproveRank(e.target.value)
                                  }
                                  style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                  }}
                                />
                                <input
                                  type="number"
                                  placeholder="退步名次 (無則免填)"
                                  value={regressRank}
                                  onChange={(e) =>
                                    setRegressRank(e.target.value)
                                  }
                                  style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                  }}
                                />
                              </div>
                            )}
                            <button
                              type="submit"
                              style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                border: 'none',
                              }}
                            >
                              ➕ 登記計算
                            </button>
                          </form>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          {(activeProfile.academicRecords || []).map((ar) => (
                            <div
                              key={ar.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 'bold' }}>
                                  {ar.subject}{' '}
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: '#64748b',
                                    }}
                                  >
                                    (
                                    {ar.type === 'daily'
                                      ? '平時'
                                      : ar.type === 'monthly'
                                      ? '月考'
                                      : '系統'}
                                    )
                                  </span>
                                </div>
                                <div
                                  style={{ fontSize: '12px', color: '#94a3b8' }}
                                >
                                  {ar.date}{' '}
                                  {ar.score !== '-' ? `| ${ar.score}分` : ''}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontWeight: '900',
                                  color: ar.reward >= 0 ? '#16a34a' : '#dc2626',
                                }}
                              >
                                {ar.reward > 0 ? '+' : ''}
                                {ar.reward} 元
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 番茄鐘與商店保留原有基礎UI */}
                {activeTab === 'pomodoro' && (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#047857',
                    }}
                  >
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, '0')}
                    <br />
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      style={{
                        fontSize: '16px',
                        padding: '10px 20px',
                        marginTop: '10px',
                      }}
                    >
                      {isTimerRunning ? '暫停' : '開始'}
                    </button>
                  </div>
                )}
                {activeTab === 'shop' && <div>商店功能建置中...</div>}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 培育新花苗 Modal */}
      {showHatchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '16px',
          }}
        >
          <form
            onSubmit={handleConfirmHatchNewPikmin}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>
              🛸 培育新花苗
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {Object.entries(PIKMIN_CATALOG).map(([key, info]) => (
                <div
                  key={key}
                  onClick={() => setHatchColor(key)}
                  style={{
                    padding: '8px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border:
                      hatchColor === key
                        ? '2px solid #16a34a'
                        : '1px solid #e2e8f0',
                    backgroundColor: hatchColor === key ? '#dcfce7' : '#f8fafc',
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{info.body}</div>
                </div>
              ))}
            </div>
            <input
              required
              type="text"
              placeholder="幫新皮克敏取名"
              value={hatchNickname}
              onChange={(e) => setHatchNickname(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowHatchModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                }}
              >
                取消
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                確認培育
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 管理者密碼 Modal */}
      {showPinModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '16px',
          }}
        >
          <form
            onSubmit={handleAdminLogin}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0' }}>解鎖管理權限</h3>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="預設 8888"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                marginBottom: '16px',
                boxSizing: 'border-box',
                textAlign: 'center',
                letterSpacing: '4px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                }}
              >
                取消
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                }}
              >
                解鎖
              </button>
            </div>
          </form>
        </div>
      )}

      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '16px',
            borderRadius: '16px',
            zIndex: 100,
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{notice.title}</div>
          <div style={{ fontSize: '13px' }}>{notice.message}</div>
        </div>
      )}
    </div>
  );
}
