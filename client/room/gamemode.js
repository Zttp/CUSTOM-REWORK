import { DisplayValueHeader, Color, Vector3 } from 'pixel_combats/basic';
import { Game, Map, Bots, MapEditor, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer, Build, AreaService, AreaPlayerTriggerService, AreaViewService, Chat, room } from 'pixel_combats/room';

const ADMIN_ID = "D411BD94CAE31F89";

const weaponColor = new Color(0, 1, 1, 0);
const skinColor = new Color(0, 5, 0, 0);
const flyColor = new Color(0, 0, 2, 0);
const hpColor = new Color(9, 0, 0, 0);
const neutralColor = new Color(1, 1, 1, 1);
const rainbowColor = new Color(1, 0.5, 0, 1);
const darkColor = new Color(0.1, 0.1, 0.1, 1);
const goldColor = new Color(1, 0.84, 0, 1);
const silverColor = new Color(0.75, 0.75, 0.75, 1);
const bronzeColor = new Color(0.8, 0.5, 0.2, 1);
const emeraldColor = new Color(0.2, 0.8, 0.2, 1);
const rubyColor = new Color(0.8, 0.2, 0.2, 1);
const sapphireColor = new Color(0.2, 0.2, 0.8, 1);

const Props = Properties.GetContext();
Props.Get('Time_Hours').Value = 0;
Props.Get('Time_Minutes').Value = 0;
Props.Get('Time_Seconds').Value = 0;
Props.Get('Players_Now').Value = 0;
Props.Get('Players_WereMax').Value = 24;
Props.Get('Time_FixedString').Value = '00:00:00';

Teams.Add('Players', 'Игроки', new Color(0, 0, 1, 0));
const PlayersTeam = Teams.Get('Players');
PlayersTeam.Spawns.SpawnPointsGroups.Add(1);
PlayersTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;

LeaderBoard.PlayerLeaderBoardValues = [
    new DisplayValueHeader('RoomID', 'ID', 'ID'),
    new DisplayValueHeader('Scores', 'Очки', 'Очки'),
    new DisplayValueHeader('Status', 'Статус', 'Статус'),
];

LeaderBoard.PlayersWeightGetter.Set(function(p) {
    return p.Properties.Get('Scores').Value;
});

room.PopupsEnabled = true;
Damage.GetContext().FriendlyFire.Value = true;
BreackGraph.OnlyPlayerBlocksDmg = true;
BreackGraph.WeakBlocks = false;
BreackGraph.BreackAll = false;
Spawns.GetContext().RespawnTime.Value = 0;
Ui.GetContext().QuadsCount.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;
Build.GetContext().CollapseChangeEnable.Value = true;

function isAdmin(player) {
    return player.Properties.Get('RoomID').Value === 1 || 
           player.id === ADMIN_ID || 
           player.Properties.Get('IsAdmin').Value === true;
}

function grantAdminRights(player) {
    player.inventory.Main.Value = true;
    player.inventory.MainInfinity.Value = true;
    player.inventory.Secondary.Value = true;
    player.inventory.SecondaryInfinity.Value = true;
    player.inventory.Explosive.Value = true;
    player.inventory.ExplosiveInfinity.Value = true;
    player.inventory.Melee.Value = true;
    player.inventory.Build.Value = true;
    player.inventory.BuildInfinity.Value = true;
    
    player.Build.Pipette.Value = true;
    player.Build.FlyEnable.Value = true;
    player.Build.BuildRangeEnable.Value = true;
    player.Build.BuildModeEnable.Value = true;
    player.Build.BalkLenChange.Value = true;
    player.Build.CollapseChangeEnable.Value = true;
    player.Build.FloodFill.Value = true;
    player.Build.FillQuad.Value = true;
    player.Build.RemoveQuad.Value = true;
    player.Build.SetSkyEnable.Value = true;
    player.Build.GenMapEnable.Value = true;
    player.Build.ChangeCameraPointsEnable.Value = true;
    player.Build.QuadChangeEnable.Value = true;
    player.Build.RenameMapEnable.Value = true;
    player.Build.ChangeMapAuthorsEnable.Value = true;
    player.Build.LoadMapEnable.Value = true;
    player.Build.ChangeSpawnsEnable.Value = true;
    
    player.contextedProperties.MaxHp.Value = 10000;
    player.Properties.Get('IsAdmin').Value = true;
}

Teams.OnRequestJoinTeam.Add(function(p, t) {
    p.Properties.Get('RoomID').Value = p.IdInRoom;
    p.Properties.Get('Ban').Value = '-';
    p.Properties.Get('IsAdmin').Value = '-';
    p.Properties.Get('VIPStatus').Value = false;
    p.Properties.Get('PassiveIncome').Value = 0;
    p.Properties.Get('Status').Value = 'Игрок';
    p.Properties.Get('KillStreak').Value = 0;
    p.Properties.Get('MaxKillStreak').Value = 0;
    p.Properties.Get('BotKills').Value = 0;
    p.Properties.Get('PendingPurchase').Value = null;

    if (p.id === ADMIN_ID || p.IdInRoom === 1) {
        grantAdminRights(p);
        p.Properties.Get('Status').Value = 'Админ';
        p.Properties.Get('IsAdmin').Value = true;
    }
    
    if (Props.Get(`${p.id}_Main`).Value) p.inventory.Main.Value = true;
    if (Props.Get(`${p.id}_MainInfinity`).Value) p.inventory.MainInfinity.Value = true;
    if (Props.Get(`${p.id}_Secondary`).Value) p.inventory.Secondary.Value = true;
    if (Props.Get(`${p.id}_SecondaryInfinity`).Value) p.inventory.SecondaryInfinity.Value = true;
    if (Props.Get(`${p.id}_Melee`).Value) p.inventory.Melee.Value = true;
    if (Props.Get(`${p.id}_Explosive`).Value) p.inventory.Explosive.Value = true;
    if (Props.Get(`${p.id}_ExplosiveInfinity`).Value) p.inventory.ExplosiveInfinity.Value = true;
    if (Props.Get(`${p.id}_Build`).Value) p.inventory.Build.Value = true;
    if (Props.Get(`${p.id}_BuildInfinity`).Value) p.inventory.BuildInfinity.Value = true;
    if (Props.Get(`${p.id}_MaxHp`).Value) p.contextedProperties.MaxHp.Value = Props.Get(`${p.id}_MaxHp`).Value;
    if (Props.Get(`${p.id}_Scores`).Value) p.Properties.Scores.Value = Props.Get(`${p.id}_Scores`).Value;
    if (Props.Get(`${p.id}_Kills`).Value) p.Properties.Kills.Value = Props.Get(`${p.id}_Kills`).Value;
    if (Props.Get(`${p.id}_Deaths`).Value) p.Properties.Deaths.Value = Props.Get(`${p.id}_Deaths`).Value;
    if (Props.Get(`${p.id}_Fly`).Value) p.Build.FlyEnable.Value = true;
    if (Props.Get(`${p.id}_Skin`).Value) p.contextedProperties.SkinType.Value = Props.Get(`${p.id}_Skin`).Value;
    if (Props.Get(`${p.id}_IsAdmin`).Value) grantAdminRights(p);
    if (Props.Get(`${p.id}_PassiveIncome`).Value) p.Properties.Get('PassiveIncome').Value = Props.Get(`${p.id}_PassiveIncome`).Value;
    if (Props.Get(`${p.id}_Status`).Value) p.Properties.Get('Status').Value = Props.Get(`${p.id}_Status`).Value;
    
    PlayersTeam.Add(p);
    p.Spawns.Spawn();
});

Teams.OnPlayerChangeTeam.Add(function(p) { 
    p.Spawns.Spawn();
    if (p.Properties.Get('Ban').Value === '+') {
        p.Spawns.Despawn();
        p.PopUp(`Вы забанены!`);
    }
});

Players.OnPlayerDisconnected.Add(function(p) {
    Props.Get(`${p.id}_Main`).Value = p.inventory.Main.Value;
    Props.Get(`${p.id}_MainInfinity`).Value = p.inventory.MainInfinity.Value;
    Props.Get(`${p.id}_Secondary`).Value = p.inventory.Secondary.Value;
    Props.Get(`${p.id}_SecondaryInfinity`).Value = p.inventory.SecondaryInfinity.Value;
    Props.Get(`${p.id}_Melee`).Value = p.inventory.Melee.Value;
    Props.Get(`${p.id}_Explosive`).Value = p.inventory.Explosive.Value;
    Props.Get(`${p.id}_ExplosiveInfinity`).Value = p.inventory.ExplosiveInfinity.Value;
    Props.Get(`${p.id}_Build`).Value = p.inventory.Build.Value;
    Props.Get(`${p.id}_BuildInfinity`).Value = p.inventory.BuildInfinity.Value;
    Props.Get(`${p.id}_MaxHp`).Value = p.contextedProperties.MaxHp.Value;
    Props.Get(`${p.id}_Scores`).Value = p.Properties.Scores.Value;
    Props.Get(`${p.id}_Kills`).Value = p.Properties.Kills.Value;
    Props.Get(`${p.id}_Deaths`).Value = p.Properties.Deaths.Value;
    Props.Get(`${p.id}_Fly`).Value = p.Build.FlyEnable.Value;
    Props.Get(`${p.id}_Skin`).Value = p.contextedProperties.SkinType.Value;
    Props.Get(`${p.id}_IsAdmin`).Value = p.Properties.Get('IsAdmin').Value;
    Props.Get(`${p.id}_Status`).Value = p.Properties.Get('Status').Value;
});

Spawns.GetContext().OnSpawn.Add(function(p) {
    p.Properties.Immortality.Value = true;
    p.Timers.Get('immortality').Restart(3);
});

Timers.OnPlayerTimer.Add(function(t) {
    if (t.Id != 'immortality') return;
    t.Player.Properties.Immortality.Value = false;
});

Damage.OnDeath.Add(function(p) {
    p.Properties.Get('KillStreak').Value = 0;
    
    Spawns.GetContext(p).Spawn();
    ++p.Properties.Deaths.Value;
});

Damage.OnDamage.Add(function(p, dmgd, dmg) {
    if (p.id != dmgd.id) {
        p.Properties.Scores.Value += Math.ceil(dmg);
        p.PopUp(`Вы нанесли ${Math.ceil(dmg)} урона`);
    }
});

Damage.OnKill.Add(function(p, k) {
    if (p.id !== k.id) { 
        ++p.Properties.Kills.Value;
        const bonus = p.Properties.Get('VIPStatus').Value ? 200 : 100;
        p.Properties.Scores.Value += bonus;
        p.PopUp(`Вы убили игрока, получено +${bonus} очков`);
    }
});

Timers.OnPlayerTimer.Add(function(timer) {
    if (timer.Id === 'passiveIncome') {
        let player = timer.Player;
        let income = player.Properties.Get('PassiveIncome').Value || 0;
        if (income > 0) {
            player.Properties.Scores.Value += income;
            player.PopUp(`Вы получили ${income} очков пассивного дохода! (Баланс: ${player.Properties.Scores.Value})`);
        }
    }
});

Bots.OnBotDeath.Add(function(deathData) {
    const bot = deathData.Bot;
    const killer = deathData.Player;
    
    if (!killer) return;
    
    killer.Properties.Scores.Value += 100;
    
    killer.Properties.Get('BotKills').Value += 1;
    
    killer.Properties.Get('KillStreak').Value += 1;
    
    const currentStreak = killer.Properties.Get('KillStreak').Value;
    
    if (currentStreak > killer.Properties.Get('MaxKillStreak').Value) {
        killer.Properties.Get('MaxKillStreak').Value = currentStreak;
    }
    
    let streakBonus = 0;
    let streakMessage = "";
    
    if (currentStreak >= 10) {
        streakBonus = 500;
        streakMessage = `СЕРИЯ x10! +500 очков!`;
    } else if (currentStreak >= 5) {
        streakBonus = 200;
        streakMessage = `Серия x5! +200 очков!`;
    } else if (currentStreak >= 3) {
        streakBonus = 50;
        streakMessage = `Серия x3! +50 очков!`;
    }
    
    if (streakBonus > 0) {
        killer.Properties.Scores.Value += streakBonus;
    }
	
    if (killer.Properties.Get('VIPStatus').Value) {
        const vipBonus = Math.floor(streakBonus * 0.5);
        if (vipBonus > 0) {
            killer.Properties.Scores.Value += vipBonus;
            streakMessage += ` (+${vipBonus} VIP бонус)`;
        }
    }
    
    killer.PopUp(`Вы убили бота! получено +100 очков (Серия: ${currentStreak}) ${streakMessage}`);
});

function initializeZones() {  
    let hpZone = AreaPlayerTriggerService.Get('hpZone');
    hpZone.Tags = ['hp'];
    hpZone.Enable = true;
    hpZone.OnEnter.Add(function(player, area) {
        let [hp, price] = area.Name.split('@').map(Number);
        if (isNaN(hp)) hp = 10;
        if (isNaN(price)) price = 100;
        
        if (player.Properties.Scores.Value >= price) {
            if (player.Properties.Get('PendingPurchase').Value === area.Name) {
                player.Properties.Scores.Value -= price;
                player.contextedProperties.MaxHp.Value += hp;
                player.Spawns.Spawn();
                player.Properties.Get('PendingPurchase').Value = null;
                player.PopUp(`Вы купили +${hp} HP за ${price} очков (Баланс: ${player.Properties.Scores.Value})`);
            } else {
                player.Properties.Get('PendingPurchase').Value = area.Name;
                player.PopUp(`Подтвердите покупку +${hp} HP за ${price} очков - зайдите в зону еще раз`);
            }
        } else {
            player.PopUp(`Вам нужно ${price} очков для покупки +${hp} HP (У вас: ${player.Properties.Scores.Value})`);
        }
    });

    let hpZoneView = AreaViewService.GetContext().Get('hpZoneView');
    hpZoneView.Color = hpColor;
    hpZoneView.Tags = ['hp'];
    hpZoneView.Enable = true;

    let skinZone = AreaPlayerTriggerService.Get('skinZone');
    skinZone.Tags = ['skin'];
    skinZone.Enable = true;
    skinZone.OnEnter.Add(function(player, area) {
        let [skinId, price] = area.Name.split('@').map(Number);
        if (isNaN(skinId)) skinId = 0;
        if (isNaN(price)) price = 1000;
        
        const skinNames = {
            0: 'Стандартный',
            1: 'Зомби',
            2: 'Зек'
        };
        
        const skinName = skinNames[skinId] || `Скин ${skinId}`;
        
        if (player.contextedProperties.SkinType.Value === skinId) {
            player.PopUp(`У вас уже установлен скин "${skinName}"`);
            return;
        }
        
        if (player.Properties.Scores.Value >= price) {
            if (player.Properties.Get('PendingPurchase').Value === area.Name) {
                player.Properties.Scores.Value -= price;
                player.contextedProperties.SkinType.Value = skinId;
                player.Properties.Get('PendingPurchase').Value = null;
                player.PopUp(`Вы купили скин "${skinName}" за ${price} очков!`);
            } else {
                player.Properties.Get('PendingPurchase').Value = area.Name;
                player.PopUp(`Подтвердите покупку скина "${skinName}" за ${price} очков - зайдите в зону еще раз`);
            }
        } else {
            player.PopUp(`Вам нужно ${price} очков для покупки скина "${skinName}" (У вас: ${player.Properties.Scores.Value})`);
        }
    });

    let skinZoneView = AreaViewService.GetContext().Get('skinZoneView');
    skinZoneView.Color = skinColor;
    skinZoneView.Tags = ['skin'];
    skinZoneView.Enable = true;

    let farmZone = AreaPlayerTriggerService.Get('farmZone');
    farmZone.Tags = ['farm'];
    farmZone.Enable = true;
    farmZone.OnEnter.Add(function(player, area) {
        let scoreAmount = Number(area.Name) || 500;
        player.Properties.Scores.Value += scoreAmount;
        player.Ui.Hint.Value = `Вы получили ${scoreAmount} очков (Баланс: ${player.Properties.Scores.Value})`;
    });

    let farmZoneView = AreaViewService.GetContext().Get('farmZoneView');
    farmZoneView.Color = new Color(1, 1, 0, 1);
    farmZoneView.Tags = ['farm'];
    farmZoneView.Enable = true;

    let hintZone = AreaPlayerTriggerService.Get('hintZone');
    hintZone.Tags = ['hint'];
    hintZone.Enable = true;
    hintZone.OnEnter.Add(function(player, area) {
        player.PopUp(area.Name);
    });

    let hintZoneView = AreaViewService.GetContext().Get('hintZoneView');
    hintZoneView.Color = neutralColor;
    hintZoneView.Tags = ['hint'];
    hintZoneView.Enable = true;

    let tpZone = AreaPlayerTriggerService.Get('tpZone');
    tpZone.Tags = ['tp'];
    tpZone.Enable = true;
    tpZone.OnEnter.Add(function(player, area) {
        let pos = area.Name.split(',').map(Number);
        if (pos.length === 3) {
            player.SetPositionAndRotation(new Vector3(pos[0], pos[1], pos[2]), new Vector3(0, 0, 0));
            player.PopUp(`Телепортирован на координаты ${pos[0]}, ${pos[1]}, ${pos[2]}`);
        }
    });

    let tpZoneView = AreaViewService.GetContext().Get('tpZoneView');
    tpZoneView.Color = neutralColor;
    tpZoneView.Tags = ['tp'];
    tpZoneView.Enable = true;

    let spawnZone = AreaPlayerTriggerService.Get('spawnZone');
    spawnZone.Tags = ['spawn'];
    spawnZone.Enable = true;
    spawnZone.OnEnter.Add(function(player) {
        player.Spawns.Spawn();
        player.PopUp(`Вы вернулись на спавн`);
    });

    let spawnZoneView = AreaViewService.GetContext().Get('spawnZoneView');
    spawnZoneView.Color = new Color(0, 1, 0, 1);
    spawnZoneView.Tags = ['spawn'];
    spawnZoneView.Enable = true;

    let passiveIncomeZone = AreaPlayerTriggerService.Get('passiveIncomeZone');
    passiveIncomeZone.Tags = ['passive'];
    passiveIncomeZone.Enable = true;
    passiveIncomeZone.OnEnter.Add(function(player, area) {
        let parts = area.Name.split('@');
        let itemName = parts[0] || "Яблоко";
        let income = Number(parts[1]) || 0;
        let price = Number(parts[2]) || 100;
        
        if (player.Properties.Scores.Value >= price) {
            if (player.Properties.Get('PendingPurchase').Value === area.Name) {
                player.Properties.Scores.Value -= price;
                let currentIncome = player.Properties.Get('PassiveIncome').Value || 0;
                player.Properties.Get('PassiveIncome').Value = currentIncome + income;
                player.Properties.Get('PendingPurchase').Value = null;
                player.PopUp(`Вы купили ${itemName} за ${price} очков. Теперь вы получаете +${income} очков каждые 10 секунд!`);
                
                if (!player.Timers.Get('passiveIncome').IsActive) {
                    player.Timers.Get('passiveIncome').RestartLoop(10);
                }
            } else {
                player.Properties.Get('PendingPurchase').Value = area.Name;
                player.PopUp(`Подтвердите покупку ${itemName} за ${price} очков - зайдите в зону еще раз`);
            }
        } else {
            player.PopUp(`Вам нужно ${price} очков для покупки ${itemName} (У вас: ${player.Properties.Scores.Value})`);
        }
    });

    let passiveIncomeZoneView = AreaViewService.GetContext().Get('passiveIncomeZoneView');
    passiveIncomeZoneView.Color = new Color(0, 1, 0, 1);
    passiveIncomeZoneView.Tags = ['passive'];
    passiveIncomeZoneView.Enable = true;

    let bonusZone = AreaPlayerTriggerService.Get('bonusZone');
    bonusZone.Tags = ['bonus'];
    bonusZone.Enable = true;
    bonusZone.OnEnter.Add(function(player, area) {
        let bonusType = area.Name.split('@')[0] || 'points';
        let bonusValue = Number(area.Name.split('@')[1]) || 1000;
        
        let bonusKey = `bonus_${area.Name}`;
        if (player.Properties.Get(bonusKey).Value) {
            player.PopUp('Вы уже получали этот бонус!');
            return;
        }
        
        player.Properties.Get(bonusKey).Value = true;
        
        switch(bonusType) {
            case 'points':
                player.Properties.Scores.Value += bonusValue;
                player.PopUp(`Вы получили бонус ${bonusValue} очков! (Баланс: ${player.Properties.Scores.Value})`);
                break;
            case 'hp':
                player.contextedProperties.MaxHp.Value += bonusValue;
                player.Spawns.Spawn();
                player.PopUp(`Вы получили бонус +${bonusValue} HP!`);
                break;
            case 'weapon':
                player.inventory.Main.Value = true;
                player.PopUp(`Вы получили бонус - основное оружие!`);
                break;
            default:
                player.Properties.Scores.Value += bonusValue;
                player.PopUp(`Вы получили бонус ${bonusValue} очков! (Баланс: ${player.Properties.Scores.Value})`);
        }
    });

    let bonusZoneView = AreaViewService.GetContext().Get('bonusZoneView');
    bonusZoneView.Color = new Color(1, 0, 1, 1);
    bonusZoneView.Tags = ['bonus'];
    bonusZoneView.Enable = true;

    let vendingZone = AreaPlayerTriggerService.Get('vendingZone');
    vendingZone.Tags = ['vending'];
    vendingZone.Enable = true;
    vendingZone.OnEnter.Add(function(player, area) {
        let drink = area.Name.split('@')[0] || 'cola';
        let price = Number(area.Name.split('@')[1]) || 50;
        
        if (player.Properties.Scores.Value < price) {
            player.PopUp(`Вам нужно ${price} очков для покупки ${drink} (У вас: ${player.Properties.Scores.Value})`);
            return;
        }
        
        if (player.Properties.Get('PendingPurchase').Value === area.Name) {
            player.Properties.Scores.Value -= price;
            player.Properties.Get('PendingPurchase').Value = null;
            
            switch(drink.toLowerCase()) {
                case 'cola':
                    player.contextedProperties.MaxHp.Value += 5;
                    player.Spawns.Spawn();
                    player.PopUp(`Вы купили Cola за ${price} очков. +5 HP! (Баланс: ${player.Properties.Scores.Value})`);
                    break;
                case 'water':
                    player.PopUp(`Вы купили Water за ${price} очков. (Баланс: ${player.Properties.Scores.Value})`);
                    break;
                case 'lipton':
                    player.Properties.Get('PassiveIncome').Value = (player.Properties.Get('PassiveIncome').Value || 0) + 1;
                    player.PopUp(`Вы купили Lipton за ${price} очков. +1 к пассивному доходу! (Баланс: ${player.Properties.Scores.Value})`);
                    if (!player.Timers.Get('passiveIncome').IsActive) {
                        player.Timers.Get('passiveIncome').RestartLoop(10);
                    }
                    break;
                default:
                    player.Properties.Scores.Value += price;
                    player.PopUp(`Неизвестный напиток: ${drink}`);
            }
        } else {
            player.Properties.Get('PendingPurchase').Value = area.Name;
            player.PopUp(`Подтвердите покупку ${drink} за ${price} очков - зайдите в зону еще раз`);
        }
    });

    let vendingZoneView = AreaViewService.GetContext().Get('vendingZoneView');
    vendingZoneView.Color = new Color(0.5, 0.5, 0.5, 1);
    vendingZoneView.Tags = ['vending'];
    vendingZoneView.Enable = true;

    let vipZone = AreaPlayerTriggerService.Get('vipZone');
    vipZone.Tags = ['vip'];
    vipZone.Enable = true;
    vipZone.OnEnter.Add(function(player, area) {
        const price = Number(area.Name) || 100000;
        
        if (player.Properties.Get('VIPStatus').Value) {
            player.PopUp('У вас уже есть VIP статус!');
            return;
        }
        
        if (player.Properties.Scores.Value >= price) {
            if (player.Properties.Get('PendingPurchase').Value === area.Name) {
                player.Properties.Scores.Value -= price;
                player.Properties.Get('VIPStatus').Value = true;
                player.Properties.Get('PendingPurchase').Value = null;
                player.PopUp(`Вы получили VIP статус за ${price} очков! Теперь вы получаете 2x очков за убийства.`);
            } else {
                player.Properties.Get('PendingPurchase').Value = area.Name;
                player.PopUp(`Подтвердите покупку VIP статуса за ${price} очков - зайдите в зону еще раз`);
            }
        } else {
            player.PopUp(`Вам нужно ${price} очков для получения VIP статуса`);
        }
    });

    let vipZoneView = AreaViewService.GetContext().Get('vipZoneView');
    vipZoneView.Color = goldColor;
    vipZoneView.Tags = ['vip'];
    vipZoneView.Enable = true;

    let randomBonusZone = AreaPlayerTriggerService.Get('randomBonusZone');
    randomBonusZone.Tags = ['randombonus'];
    randomBonusZone.Enable = true;
    randomBonusZone.OnEnter.Add(function(player, area) {
        const price = Number(area.Name) || 1000;
        
        if (player.Properties.Scores.Value >= price) {
            player.Properties.Scores.Value -= price;
            
            const bonuses = [
                { type: 'points', value: 5000, message: '5000 очков' },
                { type: 'points', value: 10000, message: '10000 очков' },
                { type: 'hp', value: 20, message: '+20 HP' },
                { type: 'weapon', value: 'main', message: 'Основное оружие' },
                { type: 'weapon', value: 'secondary', message: 'Вторичное оружие' },
                { type: 'income', value: 5, message: '+5 к пассивному доходу' }
            ];
            
            const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
            
            switch(bonus.type) {
                case 'points':
                    player.Properties.Scores.Value += bonus.value;
                    break;
                case 'hp':
                    player.contextedProperties.MaxHp.Value += bonus.value;
                    player.Spawns.Spawn();
                    break;
                case 'weapon':
                    if (bonus.value === 'main') {
                        player.inventory.Main.Value = true;
                    } else {
                        player.inventory.Secondary.Value = true;
                    }
                    break;
                case 'income':
                    player.Properties.Get('PassiveIncome').Value += bonus.value;
                    if (!player.Timers.Get('passiveIncome').IsActive) {
                        player.Timers.Get('passiveIncome').RestartLoop(10);
                    }
                    break;
            }
            
            player.PopUp(`Вы получили бонус: ${bonus.message}! (Стоимость: ${price} очков)`);
        } else {
            player.PopUp(`Вам нужно ${price} очков для получения случайного бонуса`);
        }
    });

    let randomBonusZoneView = AreaViewService.GetContext().Get('randomBonusZoneView');
    randomBonusZoneView.Color = rainbowColor;
    randomBonusZoneView.Tags = ['randombonus'];
    randomBonusZoneView.Enable = true;
}

function setupWeaponZones() {
    const weapons = [
        { tag: '1', type: 'Основное оружие', price: 10000, color: weaponColor, property: 'Main', infinityProperty: 'MainInfinity' },
        { tag: '1*', type: 'Бесконечное основное', price: 20000, color: weaponColor, property: 'MainInfinity' },
        { tag: '2', type: 'Вторичное оружие', price: 5000, color: weaponColor, property: 'Secondary', infinityProperty: 'SecondaryInfinity' },
        { tag: '2*', type: 'Бесконечное вторичное', price: 10000, color: weaponColor, property: 'SecondaryInfinity' },
        { tag: '3', type: 'Гранаты', price: 15000, color: weaponColor, property: 'Explosive', infinityProperty: 'ExplosiveInfinity' },
        { tag: '3*', type: 'Бесконечные гранаты', price: 30000, color: weaponColor, property: 'ExplosiveInfinity' },
        { tag: '4', type: 'Блоки', price: 1000, color: weaponColor, property: 'Build', infinityProperty: 'BuildInfinity' },
        { tag: '4*', type: 'Бесконечные блоки', price: 2000, color: weaponColor, property: 'BuildInfinity' },
        { tag: '5', type: 'Холодное оружие', price: 500, color: weaponColor, property: 'Melee' }
    ];

    weapons.forEach(weapon => {
        let zone = AreaPlayerTriggerService.Get(`weapon${weapon.tag}`);
        zone.Tags = ['weapon'];
        zone.Enable = true;
        zone.OnEnter.Add(function(player, area) {
            let price = Number(area.Name) || weapon.price;
            
            if (player.inventory[weapon.property].Value) {
                player.PopUp(`У вас уже есть ${weapon.type}`);
                return;
            }
            
            if (player.Properties.Scores.Value >= price) {
                if (player.Properties.Get('PendingPurchase').Value === area.Name) {
                    player.Properties.Scores.Value -= price;
                    player.inventory[weapon.property].Value = true;
                    
                    if (weapon.infinityProperty) {
                        player.inventory[weapon.infinityProperty].Value = true;
                    }
                    
                    player.Properties.Get('PendingPurchase').Value = null;
                    player.PopUp(`Вы купили ${weapon.type} за ${price} очков! (Баланс: ${player.Properties.Scores.Value})`);
                } else {
                    player.Properties.Get('PendingPurchase').Value = area.Name;
                    player.PopUp(`Подтвердите покупку ${weapon.type} за ${price} очков - зайдите в зону еще раз`);
                }
            } else {
                player.PopUp(`Вам нужно ${price} очков для покупки ${weapon.type} (У вас: ${player.Properties.Scores.Value})`);
            }
        });

        let zoneView = AreaViewService.GetContext().Get(`weapon${weapon.tag}View`);
        zoneView.Color = weapon.color;
        zoneView.Tags = ['weapon'];
        zoneView.Enable = true;
    });
}

initializeZones();
setupWeaponZones();

// Система чат-команд
Chat.OnPlayerMessage.Add(function(player, message) {
    const command = message.toLowerCase().trim();
    
    // Команда помощи
    if (command === '/help') {
        player.PopUp(`📖 ДОСТУПНЫЕ КОМАНДЫ:

👤 ОСНОВНЫЕ КОМАНДЫ:
/help - показывает это сообщение
/scores - показывает ваши очки
/status - показывает вашу статистику
/fly - включает/выключает полет (админ)
/weapons - выдает все оружия (админ)
/build - включает/выключает режим строительства (админ)
/pos - показывает вашу позицию
/tp [x] [y] [z] - телепортирует вас на координаты (админ)
/spawn - возвращает на спавн
/clear - очищает инвентарь (админ)

🎮 ИГРОВЫЕ КОМАНДЫ:
/skin [id] [skin] - меняет скин игроку (админ)
/hp [id] [число] - устанавливает HP игроку (админ)
/sethp [id] [hp] - устанавливает текущее HP (админ)
/god [id] - включает/выключает бессмертие (админ)
/vip [id] - включает/выключает VIP статус (админ)
/passiveincome [id] [число] - устанавливает пассивный доход (админ)

💰 КОМАНДЫ ОЧКОВ:
/give [id] [очки] - выдает очки игроку (админ)
/reset [id] - сбрасывает статистику игрока (админ)

👥 АДМИН КОМАНДЫ:
/admin [id] - выдает права администратора
/ban [id] - банит игрока
/unban [id] - разбанивает игрока
/setpos [id] [x] [y] [z] - телепортирует игрока (админ)
/setspawn [x] [y] [z] - устанавливает точку спавна (админ)

⚙️ СИСТЕМНЫЕ КОМАНДЫ:
/clearall [id] - очищает все данные игрока (админ)

📝 ПРИМЕРЫ:
/skin 2 1 - выдает скин зомби игроку с RoomID 2
/give 3 1000 - выдает 1000 очков игроку с RoomID 3
/setpos 4 100 50 200 - телепортирует игрока с RoomID 4

💡 ID игрока - это его RoomID (можно узнать в таблице лидеров)`);
        return false;
    }
    
    // Команда очков
    if (command === '/scores') {
        player.PopUp(`💰 Ваши очки: ${player.Properties.Scores.Value}`);
        return false;
    }
    
    // Команда статуса
    if (command === '/status') {
        player.PopUp(`📊 ВАША СТАТИСТИКА:
🎯 Статус: ${player.Properties.Get('Status').Value}
💰 Очки: ${player.Properties.Scores.Value}
🔫 Убийства: ${player.Properties.Kills.Value}
💀 Смерти: ${player.Properties.Deaths.Value}
🤖 Убийства ботов: ${player.Properties.Get('BotKills').Value}
🔥 Текущая серия: ${player.Properties.Get('KillStreak').Value}
🏆 Макс. серия: ${player.Properties.Get('MaxKillStreak').Value}
📈 Пассивный доход: ${player.Properties.Get('PassiveIncome').Value} очков/10сек
❤️ HP: ${player.contextedProperties.MaxHp.Value}
⭐ VIP: ${player.Properties.Get('VIPStatus').Value ? 'Да' : 'Нет'}
👑 Админ: ${isAdmin(player) ? 'Да' : 'Нет'}`);
        return false;
    }
    
    // Команда полета
    if (command === '/fly') {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        player.Build.FlyEnable.Value = !player.Build.FlyEnable.Value;
        player.PopUp(`✈️ Полёт ${player.Build.FlyEnable.Value ? 'включен' : 'выключен'}`);
        return false;
    }
    
    // Команда всех оружий
    if (command === '/weapons') {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        player.inventory.Main.Value = true;
        player.inventory.MainInfinity.Value = true;
        player.inventory.Secondary.Value = true;
        player.inventory.SecondaryInfinity.Value = true;
        player.inventory.Explosive.Value = true;
        player.inventory.ExplosiveInfinity.Value = true;
        player.inventory.Melee.Value = true;
        player.inventory.Build.Value = true;
        player.inventory.BuildInfinity.Value = true;
        player.PopUp('🎯 Все оружия выданы!');
        return false;
    }
    
    // Команда смены скина игроку
    if (command.startsWith('/skin ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 3) {
            const targetId = parseInt(parts[1]);
            const skinId = parseInt(parts[2]);
            const target = Players.GetByRoomId(targetId);
            
            if (target && !isNaN(skinId)) {
                target.contextedProperties.SkinType.Value = skinId;
                
                const skinNames = {
                    0: 'Стандартный',
                    1: 'Зомби', 
                    2: 'Зек',
                };
                
                const skinName = skinNames[skinId] || `Скин ${skinId}`;
                player.PopUp(`🎭 Игроку ${target.NickName} выдан скин: ${skinName}`);
                target.PopUp(`🎭 Администратор выдал вам скин: ${skinName}`);
            } else {
                player.PopUp('❌ Игрок не найден или неверный ID скина!');
            }
        } else {
            player.PopUp('📝 Использование: /skin [RoomID] [номер_скина]');
        }
        return false;
    }
    
    // Команда позиции
    if (command === '/pos') {
        const pos = player.Position;
        player.PopUp(`📍 Позиция: X=${Math.round(pos.x)}, Y=${Math.round(pos.y)}, Z=${Math.round(pos.z)}`);
        return false;
    }
    
    // Команда телепортации
    if (command.startsWith('/tp ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length === 4) {
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);
            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                player.SetPositionAndRotation(new Vector3(x, y, z), new Vector3(0, 0, 0));
                player.PopUp(`🚀 Телепортирован на X=${x}, Y=${y}, Z=${z}`);
            } else {
                player.PopUp('📝 Использование: /tp [x] [y] [z]');
            }
        } else {
            player.PopUp('📝 Использование: /tp [x] [y] [z]');
        }
        return false;
    }
    
    // Команда спавна
    if (command === '/spawn') {
        player.Spawns.Spawn();
        player.PopUp('🏠 Возврат на спавн...');
        return false;
    }
    
    // Команда очистки инвентаря
    if (command === '/clear') {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        player.inventory.Main.Value = false;
        player.inventory.MainInfinity.Value = false;
        player.inventory.Secondary.Value = false;
        player.inventory.SecondaryInfinity.Value = false;
        player.inventory.Explosive.Value = false;
        player.inventory.ExplosiveInfinity.Value = false;
        player.inventory.Melee.Value = false;
        player.inventory.Build.Value = false;
        player.inventory.BuildInfinity.Value = false;
        player.PopUp('🎒 Инвентарь очищен!');
        return false;
    }
    
    // Команда выдачи админки
    if (command.startsWith('/admin ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
            grantAdminRights(target);
            target.Properties.Get('Status').Value = 'Администратор';
            target.Properties.Get('IsAdmin').Value = true;
            player.PopUp(`👑 Игрок ${target.NickName} получил права администратора!`);
            target.PopUp('👑 Вы получили права администратора!');
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда бана
    if (command.startsWith('/ban ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
            target.Properties.Get('Ban').Value = '+';
            target.Spawns.Despawn();
            player.PopUp(`🔨 Игрок ${target.NickName} забанен!`);
            target.PopUp('🔨 Вы были забанены администратором!');
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда разбана
    if (command.startsWith('/unban ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
            target.Properties.Get('Ban').Value = '-';
            player.PopUp(`🔓 Игрок ${target.NickName} разбанен!`);
            target.PopUp('🔓 Вы были разбанены администратором!');
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда выдачи очков
    if (command.startsWith('/give ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 3) {
            const targetId = parseInt(parts[1]);
            const scores = parseInt(parts[2]);
            const target = Players.GetByRoomId(targetId);
            if (target && !isNaN(scores)) {
                target.Properties.Scores.Value += scores;
                player.PopUp(`💰 Игроку ${target.NickName} выдано ${scores} очков`);
                target.PopUp(`💰 Администратор выдал вам ${scores} очков`);
            } else {
                player.PopUp('❌ Игрок не найден или неверное число!');
            }
        } else {
            player.PopUp('📝 Использование: /give [RoomID] [очки]');
        }
        return false;
    }
    
    // Команда установки максимального HP игроку
    if (command.startsWith('/sethp ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 3) {
            const targetId = parseInt(parts[1]);
            const hp = parseInt(parts[2]);
            const target = Players.GetByRoomId(targetId);
            if (target && !isNaN(hp) && hp > 0) {
                target.contextedProperties.MaxHp.Value = hp;
                target.Spawns.Spawn();
                player.PopUp(`❤️ HP игрока ${target.NickName} установлено на ${hp}`);
                target.PopUp(`❤️ Администратор установил ваше HP на ${hp}`);
            } else {
                player.PopUp('❌ Игрок не найден или неверное число!');
            }
        } else {
            player.PopUp('📝 Использование: /sethp [RoomID] [hp]');
        }
        return false;
    }
    
    // Команда телепортации игрока
    if (command.startsWith('/setpos ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 5) {
            const targetId = parseInt(parts[1]);
            const x = parseFloat(parts[2]);
            const y = parseFloat(parts[3]);
            const z = parseFloat(parts[4]);
            const target = Players.GetByRoomId(targetId);
            if (target && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
                target.SetPositionAndRotation(new Vector3(x, y, z), new Vector3(0, 0, 0));
                player.PopUp(`🚀 Игрок ${target.NickName} телепортирован на X=${x}, Y=${y}, Z=${z}`);
                target.PopUp(`🚀 Администратор телепортировал вас на X=${x}, Y=${y}, Z=${z}`);
            } else {
                player.PopUp('❌ Игрок не найден или неверные координаты!');
            }
        } else {
            player.PopUp('📝 Использование: /setpos [RoomID] [x] [y] [z]');
        }
        return false;
    }
    
    // Команда установки спавна
    if (command.startsWith('/setspawn ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 4) {
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);
            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                PlayersTeam.Spawns.SpawnPointsGroups.Get(1).SpawnPoints.Add(new Vector3(x, y, z));
                player.PopUp(`🏠 Точка спавна установлена на X=${x}, Y=${y}, Z=${z}`);
            } else {
                player.PopUp('📝 Использование: /setspawn [x] [y] [z]');
            }
        } else {
            player.PopUp('📝 Использование: /setspawn [x] [y] [z]');
        }
        return false;
    }
    
    // Команда установки времени
    if (command.startsWith('/time ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 4) {
            const hours = parseInt(parts[1]);
            const minutes = parseInt(parts[2]);
            const seconds = parseInt(parts[3]);
            if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                Props.Get('Time_Hours').Value = hours;
                Props.Get('Time_Minutes').Value = minutes;
                Props.Get('Time_Seconds').Value = seconds;
                player.PopUp(`⏰ Время установлено на ${hours}:${minutes}:${seconds}`);
            } else {
                player.PopUp('📝 Использование: /time [ч] [м] [с]');
            }
        } else {
            player.PopUp('📝 Использование: /time [ч] [м] [с]');
        }
        return false;
    }
    
    // Команда бессмертия
    if (command.startsWith('/god ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        const targetId = parts.length >= 2 ? parseInt(parts[1]) : player.Properties.Get('RoomID').Value;
        const target = Players.GetByRoomId(targetId);
        
        if (target) {
            target.Properties.Immortality.Value = !target.Properties.Immortality.Value;
            player.PopUp(`🛡️ Бессмертие игрока ${target.NickName} ${target.Properties.Immortality.Value ? 'включено' : 'выключено'}`);
            target.PopUp(`🛡️ Бессмертие ${target.Properties.Immortality.Value ? 'включено' : 'выключено'}`);
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда VIP статуса
    if (command.startsWith('/vip ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        const targetId = parts.length >= 2 ? parseInt(parts[1]) : player.Properties.Get('RoomID').Value;
        const target = Players.GetByRoomId(targetId);
        
        if (target) {
            target.Properties.Get('VIPStatus').Value = !target.Properties.Get('VIPStatus').Value;
            player.PopUp(`⭐ VIP статус игрока ${target.NickName} ${target.Properties.Get('VIPStatus').Value ? 'включен' : 'выключен'}`);
            target.PopUp(`⭐ VIP статус ${target.Properties.Get('VIPStatus').Value ? 'включен' : 'выключен'}`);
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда установки пассивного дохода
    if (command.startsWith('/passiveincome ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const parts = command.split(' ');
        if (parts.length >= 3) {
            const targetId = parseInt(parts[1]);
            const income = parseInt(parts[2]);
            const target = Players.GetByRoomId(targetId);
            if (target && !isNaN(income)) {
                target.Properties.Get('PassiveIncome').Value = income;
                if (!target.Timers.Get('passiveIncome').IsActive) {
                    target.Timers.Get('passiveIncome').RestartLoop(10);
                }
                player.PopUp(`📈 Игроку ${target.NickName} установлен пассивный доход: ${income} очков/10сек`);
                target.PopUp(`📈 Администратор установил вам пассивный доход: ${income} очков/10сек`);
            } else {
                player.PopUp('❌ Игрок не найден или неверное число!');
            }
        } else {
            player.PopUp('📝 Использование: /passiveincome [RoomID] [число]');
        }
        return false;
    }
    
    // Команда сброса статистики
    if (command.startsWith('/reset ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
            target.Properties.Scores.Value = 0;
            target.Properties.Kills.Value = 0;
            target.Properties.Deaths.Value = 0;
            target.Properties.Get('BotKills').Value = 0;
            target.Properties.Get('KillStreak').Value = 0;
            target.Properties.Get('MaxKillStreak').Value = 0;
            target.Properties.Get('PassiveIncome').Value = 0;
            player.PopUp(`🔄 Статистика игрока ${target.NickName} сброшена!`);
            target.PopUp('🔄 Ваша статистика сброшена администратором!');
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
    // Команда очистки всех данных
    if (command.startsWith('/clearall ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
            // Получаем все свойства и сбрасываем их
            const allProps = Props.GetAll();
            for (let prop of allProps) {
                if (prop.Name.startsWith(`${target.id}_`)) {
                    prop.Value = null;
                }
            }
            
            target.inventory.Main.Value = false;
            target.inventory.MainInfinity.Value = false;
            target.inventory.Secondary.Value = false;
            target.inventory.SecondaryInfinity.Value = false;
            target.inventory.Explosive.Value = false;
            target.inventory.ExplosiveInfinity.Value = false;
            target.inventory.Melee.Value = false;
            target.inventory.Build.Value = false;
            target.inventory.BuildInfinity.Value = false;
            target.contextedProperties.MaxHp.Value = 100;
            target.Properties.Scores.Value = 0;
            target.Properties.Kills.Value = 0;
            target.Properties.Deaths.Value = 0;
            target.Properties.Get('BotKills').Value = 0;
            target.Properties.Get('KillStreak').Value = 0;
            target.Properties.Get('MaxKillStreak').Value = 0;
            target.Properties.Get('PassiveIncome').Value = 0;
            target.Properties.Get('VIPStatus').Value = false;
            target.Properties.Get('Status').Value = 'Игрок';
            target.Properties.Get('IsAdmin').Value = false;
            target.Build.FlyEnable.Value = false;
            target.contextedProperties.SkinType.Value = 0;
            
            target.Spawns.Spawn();
            player.PopUp(`🗑️ Все данные игрока ${target.NickName} очищены!`);
            target.PopUp('🗑️ Все ваши данные очищены администратором!');
        } else {
            player.PopUp('❌ Игрок не найден!');
        }
        return false;
    }
    
});

// Обновление времени каждую секунду
let seconds = 0;
let minutes = 0;
let hours = 0;

Timers.Get('timeUpdate').RestartLoop(1);
Timers.OnTimer.Add(function(timer) {
    if (timer.Id === 'timeUpdate') {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
                if (hours >= 24) {
                    hours = 0;
                }
            }
        }
        
        Props.Get('Time_Hours').Value = hours;
        Props.Get('Time_Minutes').Value = minutes;
        Props.Get('Time_Seconds').Value = seconds;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        Props.Get('Time_FixedString').Value = timeString;
        
        // Обновление количества игроков
        Props.Get('Players_Now').Value = Players.GetAll().length;
    }
});
