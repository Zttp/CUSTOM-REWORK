import { DisplayValueHeader, Color, Vector3 } from 'pixel_combats/basic';
import { Game, Map, Bots, MapEditor, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer, Build, AreaService, AreaPlayerTriggerService, AreaViewService, Chat, room } from 'pixel_combats/room';

const ADMIN_ID = "D411BD94CAE31F89";

const weaponColor = new Color(0, 1, 1, 0);
const skinColor = new Color(0, 5, 0, 0);
const flyColor = new Color(0, 0, 2, 0);
const hpColor = new Color(9, 0, 0, 0);
const neutralColor = new Color(1, 1, 1, 1);
const goldColor = new Color(1, 0.84, 0, 1);
const emeraldColor = new Color(0.2, 0.8, 0.2, 1);

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
        p.Properties.Get('Status').Value = 'Администратор';
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
    if (Props.Get(`${p.id}_VIPStatus`).Value) p.Properties.Get('VIPStatus').Value = true;
    if (Props.Get(`${p.id}_Status`).Value) p.Properties.Get('Status').Value = Props.Get(`${p.id}_Status`).Value;
    
    PlayersTeam.Add(p);
    p.Spawns.Spawn();
});

Teams.OnPlayerChangeTeam.Add(function(p) { 
    p.Spawns.Spawn();
    if (p.Properties.Get('Ban').Value === '+') {
        p.Spawns.Despawn();
        player.PopUp(`Вы забанены!`);
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
    Props.Get(`${p.id}_PassiveIncome`).Value = p.Properties.Get('PassiveIncome').Value;
    Props.Get(`${p.id}_VIPStatus`).Value = p.Properties.Get('VIPStatus').Value;
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
    if (p.Properties.Get('KillStreak').Value >= 5) {
        Chat.SystemMessage(`Игрок ${p.NickName} потерял серию из ${p.Properties.Get('KillStreak').Value} убийств!`);
    }
    p.Properties.Get('KillStreak').Value = 0;
    
    Spawns.GetContext(p).Spawn();
    ++p.Properties.Deaths.Value;
});

Damage.OnDamage.Add(function(p, dmgd, dmg) {
    if (p.id != dmgd.id) {
        p.Properties.Scores.Value += Math.ceil(dmg);
        player.PopUp(`Нанесенный урон: ${Math.ceil(dmg)}`);
    }
});

Damage.OnKill.Add(function(p, k) {
    if (p.id !== k.id) { 
        ++p.Properties.Kills.Value;
        const bonus = p.Properties.Get('VIPStatus').Value ? 200 : 100;
        p.Properties.Scores.Value += bonus;
        player.PopUp(`Убийство игрока! +${bonus} очков`);
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
    
    player.PopUp(`Убит бот! +100 очков (Серия: ${currentStreak}) ${streakMessage}`);
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
            2: 'Заключенный'
        };
        
        const skinName = skinNames[skinId] || `Скин ${skinId}`;
        
        if (player.contextedProperties.SkinType.Value === skinId) {
            player.PopUp(`У вас уже установлен этот скин "${skinName}"`);
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
        player.PopUp(`Вы получили ${scoreAmount} очков (Баланс: ${player.Properties.Scores.Value})`);
    });

    let farmZoneView = AreaViewService.GetContext().Get('farmZoneView');
    farmZoneView.Color = new Color(1, 1, 0, 1);
    farmZoneView.Tags = ['farm'];
    farmZoneView.Enable = true;

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
        { tag: '5', type: 'Нож', price: 500, color: weaponColor, property: 'Melee' }
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

function showHelp(player, page) {
    switch(page) {
        case 1:
            player.PopUp(`📖 КОМАНДЫ ПОМОЩИ (1/3)

👤 ОСНОВНЫЕ КОМАНДЫ:
/help - показывает это сообщение
/scores - показывает ваши очки
/status - показывает вашу статистику
/zones - показывает помощь по зонам
/fly - включает полет (админ)
/weapons - выдает все оружия (админ)
/build - включает режим строительства (админ)
/pos - показывает вашу позицию
/tp [x] [y] [z] - телепортирует вас (админ)
/spawn - возвращает на спавн

💡 Для продолжения введите /help 2`);
            break;
        case 2:
            player.PopUp(`📖 КОМАНДЫ ПОМОЩИ (2/3)

🎮 КОМАНДЫ УПРАВЛЕНИЯ:
/skin [id] [skin] - меняет скин игроку (админ)
/hp [id] [число] - устанавливает HP игроку (админ)
/sethp [id] [hp] - устанавливает текущее HP (админ)
/setmaxhp [id] [hp] - устанавливает макс HP (админ)
/god [id] - включает бессмертие (админ)
/vip [id] - включает VIP статус (админ)
/passiveincome [id] [число] - устанавливает доход (админ)

💰 КОМАНДЫ ОЧКОВ:
/give [id] [очки] - выдает очки игроку (админ)
/reset [id] - сбрасывает статистику (админ)

💡 Для продолжения введите /help 3`);
            break;
        case 3:
            player.PopUp(`📖 КОМАНДЫ ПОМОЩИ (3/3)

👥 АДМИН КОМАНДЫ:
/admin [id] - выдает права администратора
/ban [id] - банит игрока
/unban [id] - разбанивает игрока
/kick [id] - кикает игрока
/setpos [id] [x] [y] [z] - телепортирует игрока
/setspawn [x] [y] [z] - устанавливает спавн

🤖 КОМАНДЫ БОТОВ:
/addbot - добавляет бота
/removebots - удаляет ботов

⚙️ СИСТЕМНЫЕ КОМАНДЫ:
/clearall [id] - очищает данные игрока
/stop - останавливает сервер

💡 RoomID можно узнать в таблице лидеров`);
            break;
    }
}

function showZonesHelp(player) {
    player.PopUp(`🎯 ПОМОЩЬ ПО ЗОНАМ

🏥 ЗОНА HP:
• Тег: hpZone
• Покупка здоровья
• Цена настраивается через название зоны
• Формат: hp@цена

🎭 ЗОНА СКИНОВ:
• Тег: skinZone  
• Покупка скинов
• Цена настраивается через название зоны
• Формат: номер_скина@цена

💰 ЗОНА ФАРМА:
• Тег: farmZone
• Автоматическая выдача очков
• Количество настраивается через название зоны

🏠 ЗОНА СПАВНА:
• Тег: spawnZone
• Возврат на точку спавна

📈 ЗОНА ДОХОДА:
• Тег: passiveIncomeZone
• Покупка пассивного дохода
• Формат: название@доход@цена

⭐ ЗОНА VIP:
• Тег: vipZone
• Покупка VIP статуса
• Цена настраивается через название зоны

🔫 ЗОНЫ ОРУЖИЯ:
• Теги: weapon1, weapon2, weapon3, weapon4, weapon5
• Покупка оружия и бесконечных патронов
• Цены настраиваются через названия зон

💡 Все зоны должны быть визуализированы`);
}

Chat.OnPlayerMessage.Add(function(player, message) {
    const command = message.toLowerCase().trim();
    
    if (command === '/help') {
        showHelp(player, 1);
        return false;
    }
    
    if (command === '/help 2') {
        showHelp(player, 2);
        return false;
    }
    
    if (command === '/help 3') {
        showHelp(player, 3);
        return false;
    }
    
    if (command === '/zones') {
        showZonesHelp(player);
        return false;
    }
    
    if (command === '/scores') {
        player.PopUp(`💰 Ваши очки: ${player.Properties.Scores.Value}`);
        return false;
    }
    
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
    
    if (command === '/fly') {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        player.Build.FlyEnable.Value = !player.Build.FlyEnable.Value;
        player.PopUp(`✈️ Полёт ${player.Build.FlyEnable.Value ? 'включен' : 'выключен'}`);
        return false;
    }
    
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
                    2: 'Заключенный'
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
    
    if (command.startsWith('/hp ')) {
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
                player.PopUp(`❤️ Игроку ${target.NickName} установлено HP: ${hp}`);
                target.PopUp(`❤️ Администратор установил вам HP: ${hp}`);
            } else {
                player.PopUp('❌ Игрок не найден или неверное число HP!');
            }
        } else {
            player.PopUp('📝 Использование: /hp [RoomID] [количество_HP]');
        }
        return false;
    }
    
    if (command === '/pos') {
        const pos = player.Position;
        player.PopUp(`📍 Позиция: X=${Math.round(pos.x)}, Y=${Math.round(pos.y)}, Z=${Math.round(pos.z)}`);
        return false;
    }
    
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
    
    if (command === '/spawn') {
        player.Spawns.Spawn();
        player.PopUp('🏠 Возврат на спавн...');
        return false;
    }
    
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
    
    if (command.startsWith('/clearall ')) {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        const targetId = parseInt(command.split(' ')[1]);
        const target = Players.GetByRoomId(targetId);
        if (target) {
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
    
    if (command === '/stop') {
        if (!isAdmin(player)) {
            player.PopUp('❌ У вас нет прав для использования этой команды!');
            return false;
        }
        Game.Stop();
        return false;
    }
    
    return true;
});

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
        
        Props.Get('Players_Now').Value = Players.GetAll().length;
    }
});
