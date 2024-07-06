// с 28.06.2024 игровой режим больше не принадлежит "qupe", данный владелец режима "zttp"
// Импорт модулей
import * as Basic from 'pixel_combats/basic';
import * as API from 'pixel_combats/room';
import * as ColorsLib from './colorslib.js';
import * as JQUtils from './jqutils.js';
import { contextedProperties, Properties, Players } from 'pixel_combats/room';
import { Game, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, 
        Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer, Build, AreaPlayerTriggerService } from 'pixel_combats/room';


// Константы
const GRADIENT = API.GameMode.Parameters.GetBool("gradient"),APMIN = "FCB44B3BFF4A9878", ADMIN = "E730023519401808", BANNED = "9D481006E2EC6AD", COLORS = [ColorsLib.ColorToHex(ColorsLib.Colors.Red), ColorsLib.ColorToHex(ColorsLib.Colors.Blue), ColorsLib.ColorToHex(ColorsLib.Colors.Lime), ColorsLib.ColorToHex(ColorsLib.Colors.Yellow), ColorsLib.ColorToHex(ColorsLib.Colors.Cyan), ColorsLib.ColorToHex(ColorsLib.Colors.Magenta), ColorsLib.ColorToHex(ColorsLib.Colors.Purple), ColorsLib.ColorToHex(ColorsLib.Colors.White)];
// Доступ к функциям и модулям из "терминала"
globalThis.API = API;
globalThis.ЦенаЗомб = ЦенаЗомб;
globalThis.ЦенаЗек = ЦенаЗек;
globalThis.Зек = Зек;
globalThis.Зомби = Зомби;
globalThis.Проп = Проп;
globalThis.Help = Help;
globalThis.Хинт = Хинт;
globalThis.Полёт = Полёт;
globalThis.ЦенаОсн = ЦенаОсн;
globalThis.БКоробка = БКоробка;
globalThis.Кубик = Кубик;
globalThis.Время = Время;
globalThis.Статус = Статус;
globalThis.Бан = Бан;
globalThis.Адм = Адм;
globalThis.JQUtils = JQUtils;
globalThis.ColorsLib = ColorsLib;
globalThis.ReTick = tickrate;
globalThis.Basic = Basic;

// Переменные
let Tasks = {}, indx = 0, clr = { r: 255, g: 0, b: 0 }, clr_state = 1, tick = 0;
// Настройки
API.BreackGraph.OnlyPlayerBlocksDmg = true;
API.BreackGraph.WeakBlocks = false;
API.BreackGraph.BreackAll = false;
API.Spawns.GetContext().RespawnTime.Value = 0;
API.Ui.GetContext().QuadsCount.Value = true;
API.Build.GetContext().BlocksSet.Value = API.BuildBlocksSet.AllClear;
API.Build.GetContext().CollapseChangeEnable.Value = true;
API.Build.GetContext().FlyEnable.Value = false;
// Создание команд
let PlayersTeam = JQUtils.CreateTeam("players", { name: "<i><b><color=orange>Pʟᴀʏ</a>ᴇrs</b></i>", undername: "ᴘʟᴀʏᴇʀ", isPretty: false }, ColorsLib.Colors.Black, 1);
let BuildersTeam = JQUtils.CreateTeam("builders", { name: "<i><b><color=orange>Aᴅᴍ</a>ɪɴs</b></i>", undername: "ᴀᴅᴍɪɴ", isPretty: false }, ColorsLib.Colors.Black, 1);
let HintTeam = JQUtils.CreateTeam("players", { name: "<i><b><color=orange>Pʟᴀʏ</a>ᴇrs</b></i>", undername: "ᴘʟᴀʏᴇʀ", isPretty: false }, ColorsLib.Colors.Black, 1);

// Конфигурация
if (API.GameMode.Parameters.GetBool("Fly")) API.contextedProperties.GetContext().MaxHp.Value = 1;
if (API.GameMode.Parameters.GetBool("10000hp")) API.contextedProperties.GetContext(BuildersTeam).MaxHp.Value = 10000;
if (API.GameMode.Parameters.GetBool("godmode_admin")) BuildersTeam.Damage.DamageIn.Value = false;
if (API.GameMode.Parameters.GetBool("godmode_people")) PlayersTeam.DamageIn.Value = false;

// Интерфейс
API.LeaderBoard.PlayerLeaderBoardValues = [
    {
        Value: "Статус",
        DisplayName: "<color=lime><i><b>Статус</b></i></a>",
        ShortDisplayName: "<color=lime><i><b>Статус</b></i></a>"
    },
    {
        Value: "rid",
        DisplayName: "<color=red><i><b>Rɪᴅ</b></i></a>",
        ShortDisplayName: "<color=red><i><b>Rɪᴅ</b></i></a>"
    },
    {
        Value: "banned",
        DisplayName: "Бан",
        ShortDisplayName: "Бан"
    },
    {
        Value: "Scores",
        DisplayName: "<i><color=yellow><b>Монеты</b></a></i>",
        ShortDisplayName: "<i><color=yellow><b>Монеты</b></a></i>"
    }
];

API.Ui.GetContext().TeamProp1.Value = {
    Team: "builders", Prop: "hint"
};
API.Ui.GetContext().TeamProp2.Value = {
    Team: "players", Prop: "hint"
};

Teams.Get("players").Properties.Get("hint").Value = "<size=70><color=orange>Eɴɢ</a>ɪɴᴇ 2</size>";
Teams.Get("builders").Properties.Get("hint").Value = "<size=70><color=orange>Vᴇʀ</a>sɪᴏɴ 0.1</size>";
// События

function e_join(p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            if (p.IdInRoom == 1 || p.Id == ADMIN || p.Id == APMIN) API.Properties.GetContext().Get("team" + p.Id).Value = "builders";
            p.Properties.Get("banned").Value = API.Properties.GetContext().Get("banned" + p.Id).Value || false;
            p.Properties.Get("rid").Value = p.IdInRoom;
            p.Properties.Get("Time").Value = 0; // Инициализация игрового времени
            p.Properties.Get("Scores").Value = 500; // Инициализация очков
            let team = API.Properties.GetContext().Get("team" + p.Id).Value || "players";
            API.Teams.Get(team).Add(p);
        }

        p.OnIsOnline.Add(function () {
            API.room.PopUp(p.IsOnline);
        })
    }, true);
}
API.Teams.OnRequestJoinTeam.Add(e_join);
API.Players.OnPlayerConnected.Add(function (p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            if (p.IdInRoom == 1 || p.Id == ADMIN || p.Id == APMIN) API.Properties.GetContext().Get("team" + p.Id).Value = "builders";
            p.Properties.Get("banned").Value = API.Properties.GetContext().Get("banned" + p.Id).Value || false;
            p.Properties.Get("rid").Value = p.IdInRoom;
            let team = API.Properties.GetContext().Get("team" + p.Id).Value || "players";
            API.Teams.Get(team).Add(p);
            let timePlayed = p.Properties.Get("Time").Value || 0;
            let scores = p.Properties.Get("Scores").Value || 0;
            let tim = p.Timers.Get("999999");
            tim.RestartLoop(1, function() {
                timePlayed++; // Увеличиваем игровое время на каждой итерации
                p.Properties.Get("Time").Value = timePlayed; // Сохраняем игровое время
                // Здесь можно добавить логику увеличения Scores
            });
        }
    }, true);
});
API.Players.OnPlayerConnected.Add(function (p) {
    JQUtils.pcall(function () {
        if (p.Team == null) {
            // Инициализация переменных для времени
            p.Properties.Get("hours").Value = 0;
            p.Properties.Get("minutes").Value = 0;
            // Инициализация для Scores
            p.Properties.Get("Scores").Value = 0;
            
            let tim = p.Timers.Get("g");
            tim.RestartLoop(60, function() {
                // Увеличение минут на каждой итерации
                let minutes = p.Properties.Get("minutes").Value || 0;
                let hours = p.Properties.Get("hours").Value || 0;
                minutes++;
                
                // Обновление часов, если прошло 60 минут
                if (minutes >= 60) {
                    hours++;
                    minutes = 0;
                }
                
                // Сохранение времени обратно в свойства игрока
                p.Properties.Get("hours").Value = hours;
                p.Properties.Get("minutes").Value = minutes;
            });
        }
    }, true);
});

// Функция для форматирования времени в формат HH:mm
function formatTime(hours, minutes) {
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return formattedHours + ":" + formattedMinutes;
}

API.contextedProperties.GetContext(BuildersTeam).MaxHp.Value = 100;
API.contextedProperties.GetContext(BuildersTeam).SkinType.Value = 0;

API.Teams.OnPlayerChangeTeam.Add(function (p) {
    if (p.Properties.Get("banned").Value) {
        p.Spawns.Despawn();
    }
    else {
        p.Spawns.Spawn();
        p.Spawns.Spawn()
	p.Properties.Get("Статус").Value = "<b>Guest</b>";
    if (p.id == "FCB44B3BFF4A9878") {
        p.Properties.Get("Статус").Value = "<i><color=lime>сп</color></i>";
        }
    if (p.id == "C925816BE50844A9") {
        p.Properties.Get("Статус").Value = "<i><color=orange>xSamuraiDem</color></i>";
	contextedProperties.GetContext().SkinType.Value = 6;
    }
       var spawnHint = "<b>Версия режима 0.1, (в разработке)</b>"
       p.PopUp(spawnHint);
       p.Properties.Get("Scores").Value = 500;
    }
});

	Damage.OnKill.Add(function(player, killed) {
  if (player.id !== killed.id) { 
    ++player.Properties.Kills.Value;
    player.Properties.Scores.Value += 10;
  }
});

API.Players.OnPlayerDisconnected.Add(function (p) {
    API.Properties.GetContext().Get("banned" + p.Id).Value = p.Properties.Get("banned").Value;
    if (tick == 0) JQUtils.JQTimer(tickrate, 0.05);
});

API.Teams.OnAddTeam.Add(function (t) {
    let bl = t.Id == "players" ? false : true;
    API.Build.GetContext(t).Pipette.Value = bl;
    API.Build.GetContext(t).FloodFill.Value = bl;
    API.Build.GetContext(t).FillQuad.Value = bl;
    API.Build.GetContext(t).RemoveQuad.Value = bl;
    API.Build.GetContext(t).BalkLenChange.Value = bl;
    API.Build.GetContext(t).SetSkyEnable.Value = bl;
    API.Build.GetContext(t).GenMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeCameraPointsEnable.Value = bl;
    API.Build.GetContext(t).QuadChangeEnable.Value = bl;
    API.Build.GetContext(t).BuildModeEnable.Value = bl;
    API.Build.GetContext(t).RenameMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeMapAuthorsEnable.Value = bl;
    API.Build.GetContext(t).LoadMapEnable.Value = bl;
    API.Build.GetContext(t).ChangeSpawnsEnable.Value = bl;
    API.Build.GetContext(t).BuildRangeEnable.Value = bl;
    API.Inventory.GetContext(t).Main.Value = bl;
    API.Inventory.GetContext(t).MainInfinity.Value = bl;
    API.Inventory.GetContext(t).Secondary.Value = bl;
    API.Inventory.GetContext(t).SecondaryInfinity.Value = bl;
    API.Inventory.GetContext(t).Melee.Value = bl;
    API.Inventory.GetContext(t).BuildInfinity.Value = bl;
    API.Inventory.GetContext(t).Build.Value = bl;
    API.Inventory.GetContext(t).Explosive.Value = bl;
    API.Inventory.GetContext(t).ExplosiveInfinity.Value = bl;
});
HintTeam.Properties.Get("hint").Value = `<size=120><b><i><color=orange>Eɴɢ</a>ɪɴᴇ 2</i></b></size>`;

function tickrate() {
    tick++;
    if (GRADIENT) {
        /*if (indx < COLORS.length -
        else indx = 0;
        HintTeam.Properties.Get("hint").Value = `<B><color=${COLORS[indx]}>Better!</color> EDITOR</B><i>\n\nby just_qstn</i>`;*/
        if (clr_state == 1) {
            clr.r-=5;
            clr.g+=5;
            if (clr.g == 255) clr_state = 2;
        }
        else if (clr_state == 2) {
            clr.g-=5;
            clr.b+=5;
            if (clr.b == 255) clr_state = 3;
        }
        else if (clr_state == 3) {
            clr.b-=5;
            clr.r+=5;
            if (clr.r == 255) clr_state = 1;
        }
        HintTeam.Properties.Get("hint").Value = `<size=120><b><i><color=orange>Eɴɢ</a>ɪɴᴇ 2</i></b></size>`
}
    /*for (let task in Tasks) {
        let area = API.AreaService.Get(task);
        if (area.Ranges.Count > 0) {
            for (let i = area.Ranges.Count; i--;) {
                JQUtils.pcall(() => { Tasks[task](); }, true);
            }
            area.Ranges.Clear();
        }
        else {
            delete Tasks[task];
        }
    }*/
}
// Список з
var zekPrice = 250000

var BuyPrisonSkinTrigger = AreaPlayerTriggerService.Get("зек")
BuyPrisonSkinTrigger.Tags = ["зек"];
BuyPrisonSkinTrigger.Enable = true;
BuyPrisonSkinTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Скин зека стоит ${zekPrice} очков , твой баланс: ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > ${zekPrice} - 1) {
    player.Ui.Hint.Value = `Ты купил скин зека за ${zekPrice} очков, осталось  ${player.Properties.Scores.Value} `;
    player.Properties.Scores.Value -= ${zekPrice};
    player.contextedProperties.SkinType.Value = 2;
    player.Spawns.Spawn();
  }
});
var zombPrice = 450000

var BuyZombieSkinTrigger = AreaPlayerTriggerService.Get("зомби")
BuyZombieSkinTrigger.Tags = ["зомби"];
BuyZombieSkinTrigger.Enable = true;
BuyZombieSkinTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Скин зомби стоит ${zombPrice} очков , твой баланс: ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > ${zombPrice} - 1) {
    player.Ui.Hint.Value = `Ты купил скин зомби за ${zombPrice} очков, осталось  ${player.Properties.Scores.Value} `;
    player.Properties.Scores.Value -= ${zombPrice};
    player.contextedProperties.SkinType.Value = 1;
    player.Spawns.Spawn();
  }
});
var mainWeaponPrice = 100000; // Установите начальное значение стоимости основного оружия

var BuyMainTrigger = AreaPlayerTriggerService.Get("Основа");
BuyMainTrigger.Tags = ["Основа"];
BuyMainTrigger.Enable = true;
BuyMainTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Основное оружие, цена: ${mainWeaponPrice} очков, у тебя: ${player.Properties.Scores.Value} очков`;
  
  // by qupe
  if (player.inventory.Main.Value) {
    player.Ui.Hint.Value = `Вы уже купили основное оружие ${player.inventory.Main.Value}!`;
    return;
  }
  
  if (player.Properties.Scores.Value > mainWeaponPrice - 1) {
    player.Ui.Hint.Value = `Ты купил основное оружие, твой баланс очков: ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= mainWeaponPrice;
    player.inventory.Main.Value = true;
    player.Spawns.Spawn();
  } else {
    player.Ui.Hint.Value = `Недостаточно средств для покупки основного оружия!`;
  }
});
var scoreAmount = 50;

var BuyMainTrigge = AreaPlayerTriggerService.Get("фарм");
BuyMainTrigge.Tags = ["фарм"];
BuyMainTrigge.Enable = true;
BuyMainTrigge.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Ты получил 50 монет !`;
  
  player.Properties.Scores.Value += scoreAmount; // примерная сумма очков, которую игрок получит за вход в зону "Основа"
});
// пример имени: /Ban(1);
API.Chat.OnMessage.Add(function(message) {
    if (message.TeamId == BuildersTeam.Id && message.Text[0] == "/")
    {

        API.Ui.GetContext().Hint.Value = ` ${message.Text.slice(1)}`;
        JQUtils.pcall(new Function(message.Text.slice(1)), true);
    }
});
// Функции
	
function Бан(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p.IdInRoom == 1 || p.Id == ADMIN || p.Id == APMIN) return;
    if (p.Properties.Get("banned").Value) {
        p.Properties.Get("banned").Value = false;
        p.Spawns.Spawn();
    } else {
        p.Properties.Get("banned").Value = true;
        p.PopUp("Вᴀс зᴀбᴀнил ᴀдминистᴘᴀтоᴘ сеᴘвеᴘᴀ !");
        p.Spawns.Despawn();
    }
}
function Адм(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p.Id == ADMIN || p.Id == APMIN) return;
    if (p.Team == PlayersTeam) {
        BuildersTeam.Add(p);
        API.Properties.GetContext().Get(`team${p.Id}`).Value = "builders";
        p.PopUp("<b><i>Bᴀм выдᴀли пᴘᴀʙᴀ ᴀдмиʜиᴄᴛᴘᴀᴛᴏᴘᴀ !</i></b>");
    }
    else {
        PlayersTeam.Add(p);
        p.PopUp("<b><i>У вᴀс отобᴘᴀли пᴘᴀʙᴀ ᴀдмиʜиᴄᴛᴘᴀᴛᴏᴘᴀ !</i></b>");
        API.Properties.GetContext().Get(`team${p.Id}`).Value = "players";
    }
}
function Статус(id,status) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        p.Properties.Get("Статус").Value = status;
        p.PopUp(`Вам присвоен статус "${status}" !`);
    }
}
function Время(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let currentTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}); // Get current Moscow time

    // Display the current Moscow time to the player
    player.PopUp("Московское время в момент ввода данной команды: " + currentTime);
} 
function Кубик(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let diceRoll = Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6

    // Display the rolled number to the player
    player.PopUp("<b>Выпавшее число: </b>" + diceRoll);
}
function БКоробка(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        if (p.Properties.Scores.Value >= 50) {
            let chance = Math.random() * 100;
            if (chance < 99.5) {
                let randomScores = Math.floor(Math.random() * 491) + 10;
                p.Properties.Scores.Value += randomScores;
                p.PopUp(`Вы получили ${randomScores} Scores!`);
                p.Properties.Scores.Value -= 50;
            } else {
                p.Properties.Get("Статус").Value = "<b>Premium</b>";
                p.PopUp(`Вам выпал статус "Premium"!`);
                p.Properties.Scores.Value -= 50;
            }
        } else {
            p.PopUp("Не хватает монет");
        }
    }
}
// Установите начальное значение стоимости основного оружия

function ЦенаОсн(id, newPrice) {
    mainWeaponPrice = newPrice; // Обновляем значение mainWeaponPrice

    // Получаем всех игроков в комнате
    let players = API.Players.GetAll();

    for (let player of players) {
        player.Properties.Get("Цена оружия").Value = newPrice; // Устанавливаем новую цену для игрока
        player.PopUp(`Цена покупки основного оружия установлена на ${newPrice} очков!`);
    }
}
function ЦенаЗек(id, newPrice) {
    zekPrice = newPrice; // Обновляем значение mainWeaponPrice

    // Получаем всех игроков в комнате
    let players = API.Players.GetAll();

    for (let player of players) {
        player.Properties.Get("Цена зека").Value = newPrice; // Устанавливаем новую цену для игрока
        player.PopUp(`Цена покупки скина зека установлена на ${newPrice} очков!`);
    }
}
function ЦенаЗомб(id, newPrice) {
    zombPrice = newPrice; // Обновляем значение mainWeaponPrice

    // Получаем всех игроков в комнате
    let players = API.Players.GetAll();

    for (let player of players) {
        player.Properties.Get("Цена zomb").Value = newPrice; // Устанавливаем новую цену для игрока
        player.PopUp(`Цена покупки zomb установлена на ${newPrice} очков!`);
    }
}
function Help(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        p.PopUp(`<b><i><color=orange>Помощь по зонам и командам</a>      1. Зона покупки основного оружия (Тег : Основа) Цена покупки основного оружия меняется командой "ЦенаОсн" Пример работы: "/ЦенаОсн("1","500")" В данном случае 1 это rid игрока а 500 новая цена покупки. (Тег для зоны покупки пистолета : Sec, Для гранат : Gr , Для Ножа : Нож, Для Блоков : Блок)  (Команда смены цены для Пистолета : ЦенаВтор, Для гранат : ЦенаГр, Для Блоков : ЦенаБлок, Для ножа : ЦенаНож)</i></b>`);
	p.PopUp('<b><i><color=orange>Прочие Команды</a>       2. /Кубик(rid) : Показывает случайную цифру от 1 до 6, можно использовать для развлечения, 3. /Время(rid) : Показывает текущее время по мск. 4. /Адм(rid) : кидает игрока в команду админов 5. /Бан(rid) Банит игрока на сервере , перезаход не поможет, 6. /Коробка(rid), Открывает коробку стоимостью 50 очков, из нее может выпасть от 10 до 500 очков а также с шансом 0.5% статус "Premium"</i></b>');
    }
}
function Полёт(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.Build.FlyEnable.Value = true;
    p.PopUp("Вам выдан полёт!");
}
function Хинт(id,newHint) {
    spawnHint = newHint; // Обновляем значение mainWeaponPrice

    // Получаем всех игроков в комнате
    let players = API.Players.GetAll();

    for (let player of players) {
    }
}
function Проп(id,customPlayersHint,customBuildersHint) {
    let team = API.Players.GetByRoomId(parseInt(id));
    
    Teams.Get("players").Properties.Get("hint").Value = customPlayersHint;
    Teams.Get("builders").Properties.Get("hint").Value = customBuildersHint;
    
    if (team.Team == players) {
        team.PopUp("Теперь ты игрок");
    } else {
        team.PopUp("Теперь ты админ");
    }
}
function Зомби(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.contextedProperties.SkinType.Value = 1;
    p.PopUp("Вам выдан скин зомби!");
}
function Зек(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.contextedProperties.SkinType.Value = 2;
    p.PopUp("Вам выдан скин зека!");
}
