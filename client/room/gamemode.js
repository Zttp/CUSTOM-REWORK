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
const GRADIENT = API.GameMode.Parameters.GetBool("gradient"),APMIN = "FCB44B3BFF4A9878", ADMIN = "A7641738662C517E", BANNED = "", COLORS = [ColorsLib.ColorToHex(ColorsLib.Colors.Red), ColorsLib.ColorToHex(ColorsLib.Colors.Blue), ColorsLib.ColorToHex(ColorsLib.Colors.Lime), ColorsLib.ColorToHex(ColorsLib.Colors.Yellow), ColorsLib.ColorToHex(ColorsLib.Colors.Cyan), ColorsLib.ColorToHex(ColorsLib.Colors.Magenta), ColorsLib.ColorToHex(ColorsLib.Colors.Purple), ColorsLib.ColorToHex(ColorsLib.Colors.White)];
// Доступ к функциям и модулям из "терминала"
globalThis.API = API;
globalThis.RN = RN;
globalThis.Combat = Combat;
globalThis.РН = РН;
globalThis.Лото = Лото;
globalThis.RPS = RPS;
globalThis.Kill = Kill;
globalThis.ServerKill = ServerKill;
globalThis.Деньги = Деньги;
globalThis.Ультра = Ультра;
globalThis.Лидеры = Лидеры;
globalThis.Награда = Награда;
globalThis.Вопрос = Вопрос;
globalThis.Синий = Синий;
globalThis.Комп = Комп;
globalThis.Ка = Ка;
globalThis.SS2 = SS2;
globalThis.SS3 = SS3;
globalThis.Зек = Зек;
globalThis.Нхп = Нхп;
globalThis.Зомби = Зомби;
globalThis.Проп = Проп;
globalThis.Help = Help;
globalThis.Хинт = Хинт;
globalThis.Полет = Полет;
globalThis.ЦенаОсн = ЦенаОсн;
globalThis.БКоробка = БКоробка;
globalThis.ЛКоробка = ЛКоробка;
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
    },
    {
        Value: "CP",
        DisplayName: "<b><size=30><color=#ffe102>C</color><color=#ffc401>P</color></size></b>",
        ShortDisplayName: "<b><size=30><color=#ffe102>C</color><color=#ffc401>P</color></size></b>"
}
];

API.Ui.GetContext().TeamProp1.Value = {
    Team: "builders", Prop: "hint"
};
API.Ui.GetContext().TeamProp2.Value = {
    Team: "players", Prop: "hint"
};

Teams.Get("players").Properties.Get("hint").Value = "<size=70><color=orange>Eɴɢ</a>ɪɴᴇ 2</size>";
Teams.Get("builders").Properties.Get("hint").Value = "<size=70><color=orange>Введи команду</a> /Help(1) для помощи</size>";
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
	p.Properties.Get("Статус").Value = "<b>Игрок</b>";
    if (p.id == "FCB44B3BFF4A9878") {
        p.Properties.Get("Статус").Value = "<i><color=lime>pretty boy</color></i>";
        }
    if (p.id == "A7641738662C517E") {
        p.Properties.Get("Статус").Value = "<b><color=white>Premium Плюшка</color></b>";
	contextedProperties.GetContext().SkinType.Value = 6;
    }
       var spawnHint = "<i><b><color=orange>Обновление 1.4,</a>         Вы этого точно не ждали (ужас просто , докатились) : <color=red>КОЛЛАБОРАЦИЯ С Ultra Demon'ом!!!</a>, в рамках коллабы я сделал Ультра Ящик который можно купить командой /Ультра(rid) , он стоит 66600 монет) Из этого ящика может выпасть с шансом 5% Скин зека, С шансом 0.1% Статус 'UltraDemon', с шансом 0.01% 6660000 монет а также с шансом 0.0001% 10 штук CP</b></i>"
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
var BuyExplosiveTrigger = AreaPlayerTriggerService.Get("гран")
BuyExplosiveTrigger.Tags = ["гран"];
BuyExplosiveTrigger.Enable = true;
BuyExplosiveTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Гранаты стоят 100000 очков а твой баланс: ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 99999) {
    player.Ui.Hint.Value = `Ты приобрел Гранаты за 100000 очков, твой баланс: ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 100000;
    player.inventory.Explosive.Value = true;
    player.Spawns.Spawn();
  }
});

var AdmTrigger = AreaPlayerTriggerService.Get("адм")
AdmTrigger.Tags = ["адм"];
AdmTrigger.Enable = true;
AdmTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `${player.Properties.Scores.Value}`;
  if (player.Properties.Scores.Value > -999999990) {
    player.Ui.Hint.Value = `Тебе выдана админка`;
    player.Properties.Scores.Value -= 0;
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
    player.Spawns.Spawn();
  }
});

var BuyFlyTrigger = AreaPlayerTriggerService.Get("полет")
BuyFlyTrigger.Tags = ["полет"];
BuyFlyTrigger.Enable = true;
BuyFlyTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Стоимость полёта 1000000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 999999) {
    player.Ui.Hint.Value = ` ${player.NickName} Купил Полёт!!!`;
    player.Properties.Scores.Value -= 1000000;
    player.Build.FlyEnable.Value = true;
    player.Spawns.Spawn();
  }
});

var SpawnTrigger = AreaPlayerTriggerService.Get("спавн")
SpawnTrigger.Tags = ["спавн"];
SpawnTrigger.Enable = true;
SpawnTrigger.OnEnter.Add(function(player){
  player.Spawns.Spawn();
  player.Ui.Hint.Value = `Ты вернулся на спавн`;
});
var BuyMainInfinityTrigger = AreaPlayerTriggerService.Get("Mainf")
BuyMainInfinityTrigger.Tags = ["Mainf"];
BuyMainInfinityTrigger.Enable = true;
BuyMainInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные патроны на автомат стоят 70000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 69999) {
    player.Ui.Hint.Value = `Ты купил бесконечные патроны на автомат за 70000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 70000;
    player.inventory.MainInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyMeleeTrigger = AreaPlayerTriggerService.Get("Kn")
BuyMeleeTrigger.Tags = ["Kn"];
BuyMeleeTrigger.Enable = true;
BuyMeleeTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Ты не можешь купить нож т.к его стоимость 15000 очков а у тебя только ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 14999) {
    player.Ui.Hint.Value = `Ты купил нож за 15000 очков, текущий баланс: ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 15000;
    player.inventory.Melee.Value = true;
    player.Spawns.Spawn();
  }
});

var BuySecondaryTrigger = AreaPlayerTriggerService.Get("Pst")
BuySecondaryTrigger.Tags = ["Pst"];
BuySecondaryTrigger.Enable = true;
BuySecondaryTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Пистолет стоит 65000 очков, а у тебя только ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 64999) {
    player.Ui.Hint.Value = `Ты купил пистолет за 65000 очков, текущий баланс: ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 65000;
    player.inventory.Secondary.Value = true;
    player.Spawns.Spawn();
  }
});

var BuySecondaryInfinityTrigger = AreaPlayerTriggerService.Get("Pstf")
BuySecondaryInfinityTrigger.Tags = ["Pstf"];
BuySecondaryInfinityTrigger.Enable = true;
BuySecondaryInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные патроны на пистолет стоят 50000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 49999) {
    player.Ui.Hint.Value = `Ты купил бесконечные патроны на пистолет за 50000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 50000;
    player.inventory.SecondaryInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyExplosiveInfinityTrigger = AreaPlayerTriggerService.Get("Grf")
BuyExplosiveInfinityTrigger.Tags = ["Grf"];
BuyExplosiveInfinityTrigger.Enable = true;
BuyExplosiveInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные гранаты стоят 1000000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 999999) {
    player.Ui.Hint.Value = `Ты купил бесконечные гранаты за 1000000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 1000000;
    player.inventory.ExplosiveInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyBuildInfinityTrigger = AreaPlayerTriggerService.Get("Blocksf")
BuyBuildInfinityTrigger.Tags = ["Blocksf"];
BuyBuildInfinityTrigger.Enable = true;
BuyBuildInfinityTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Бесконечные блоки стоят 9000000 очков а у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 8999999) {
    player.Ui.Hint.Value = `Ты купил бесконечные блоки за 9000000 очков , баланс ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 9000000;
    player.inventory.BuildInfinity.Value = true;
    player.Spawns.Spawn();
  }
});

var BuyPlus1MaxHpTrigger = AreaPlayerTriggerService.Get("1hp")
BuyPlus1MaxHpTrigger.Tags = ["1hp"];
BuyPlus1MaxHpTrigger.Enable = true;
BuyPlus1MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `1хп стоит 700 очков , но у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 699) {
    player.Ui.Hint.Value = `Поздравляю, ты купил 1хп за 700 очков , осталось ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 700;
    player.contextedProperties.MaxHp.Value += 1;
    player.Spawns.Spawn();
  }
});
var BuyPlus10MaxHpTrigger = AreaPlayerTriggerService.Get("10hp")
BuyPlus10MaxHpTrigger.Tags = ["10hp"];
BuyPlus10MaxHpTrigger.Enable = true;
BuyPlus10MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `10хп стоят 7000 очков , но у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 6999) {
    player.Ui.Hint.Value = `Поздравляю, ты купил 10хп за 7000 очков , осталось ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 7000;
    player.contextedProperties.MaxHp.Value += 10;
    player.Spawns.Spawn();
  }
});
var BuyPlus100MaxHpTrigger = AreaPlayerTriggerService.Get("100hp")
BuyPlus100MaxHpTrigger.Tags = ["100hp"];
BuyPlus100MaxHpTrigger.Enable = true;
BuyPlus100MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `100хп стоят 70000 очков , но у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 69999) {
    player.Ui.Hint.Value = `Поздравляю, ты купил 100хп за 70000 очков , осталось ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 70000;
    player.contextedProperties.MaxHp.Value += 100;
    player.Spawns.Spawn();
  }
});
var BuyPlus1000MaxHpTrigger = AreaPlayerTriggerService.Get("1000hp")
BuyPlus1000MaxHpTrigger.Tags = ["1000hp"];
BuyPlus1000MaxHpTrigger.Enable = true;
BuyPlus1000MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `1000хп стоят 700000 очков , но у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 699999) {
    player.Ui.Hint.Value = `Поздравляю, ты купил 1000хп за 700000 очков , осталось ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 700000;
    player.contextedProperties.MaxHp.Value += 1000;
    player.Spawns.Spawn();
  }
});
var BuyPlus10000MaxHpTrigger = AreaPlayerTriggerService.Get("10000hp")
BuyPlus10000MaxHpTrigger.Tags = ["10000hp"];
BuyPlus10000MaxHpTrigger.Enable = true;
BuyPlus10000MaxHpTrigger.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `10000хп стоят 7000000 очков , но у тебя ${player.Properties.Scores.Value} очков`;
  if (player.Properties.Scores.Value > 6999999) {
    player.Ui.Hint.Value = `Поздравляю, ты купил 10000хп за 7000000 очков , осталось ${player.Properties.Scores.Value} очков`;
    player.Properties.Scores.Value -= 7000000;
    player.contextedProperties.MaxHp.Value += 10000;
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
var scoreAmount = 500;

var BuyMainTrigge = AreaPlayerTriggerService.Get("фарм");
BuyMainTrigge.Tags = ["фарм"];
BuyMainTrigge.Enable = true;
BuyMainTrigge.OnEnter.Add(function(player){
  player.Ui.Hint.Value = `Ты получил 500 монет !`;
  
  player.Properties.Scores.Value += 500; // примерная сумма очков, которую игрок получит за вход в зону "Основа"
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
function Нхп(id,hp) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        p.contextedProperties.MaxHp.Value = hp;
        p.PopUp(`Ваше количество хп "${hp}" !`);
    }
}
function Время(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let currentTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}); // Get current Moscow time

    // Display the current Moscow time to the player
    player.PopUp("Московское время в момент ввода данной команды: " + currentTime);
}
function RN(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    
    let vowels = "aeiou";
    let consonants = "bcdfghjklmnpqrstvwxyz";
    
    let generatedNicknames = [];
    for (let i = 0; i < 5; i++) {
        let nickname = "";
        for (let j = 0; j < 6; j++) {
            if (j % 2 == 0) {
                nickname += consonants.charAt(Math.floor(Math.random() * consonants.length));
            } else {
                nickname += vowels.charAt(Math.floor(Math.random() * vowels.length));
            }
        }
        generatedNicknames.push(nickname);
    }
    
    let formattedNicknames = "";
    for (let nickname of generatedNicknames) {
        formattedNicknames += "<b>Сгенерированный никнейм: </b>" + nickname + "";
    }
    
    player.PopUp(formattedNicknames);
}
function РН(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    
    let vowels = "еуаоэяию";
    let consonants = "цкнгшзхфвпрлджчсмтб";
    
    let generatedNicknames = [];
    for (let i = 0; i < 10; i++) {
        let nickname = "";
        for (let j = 0; j < 6; j++) {
            if (j % 2 == 0) {
                nickname += consonants.charAt(Math.floor(Math.random() * consonants.length));
            } else {
                nickname += vowels.charAt(Math.floor(Math.random() * vowels.length));
            }
        }
        generatedNicknames.push(nickname);
    }
    
    let formattedNicknames = "";
    for (let nickname of generatedNicknames) {
        formattedNicknames += "<b>Сгенерированный никнейм: </b>" + nickname + "<br>";
    }
    
    player.PopUp(formattedNicknames);
}
function ServerKill(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let i = 0;
    
    let timer = setInterval(function() {
        // Display seconds left in the hint
        API.Ui.GetContext().Hint.Value = "Game Overloading in " + (25 - i) + " seconds...";
        
        if (i === 25) {
            clearInterval(timer);
            
            // Display message to player indicating game overload
            player.PopUp("<b>Game Overloaded! Please rejoin.</b>");
            
            // System hangs for 1 second
            setTimeout(function() {
                let j = 0;
                while (j < 1000000000) {
                    j++;
                }
            }, 1000);
        }
        
        i++;
    }, 1000);
}
function Kill(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    
    // Run a loop that will overload the game for the selected player
    let i = 0;
    while (i < 10000000000) {
        i++;
    }
    
    // Display a message to the selected player to indicate that the game is overloaded
    player.PopUp("<b>Игра перегружена! Пожалуйста, перезайдите.</b>");
} 
// Usage:
// LoadGame(12345); // Replace 12345 with the desired player's room ID to overload their game.
function Лидеры(id) {
    let player = API.Players.GetByRoomId(parseInt(id)); // Get current Moscow time

    // Display the current Moscow time to the player
    player.PopUp("<b><i><color=yellow> 1. IS 360</a> (40 ОП)            <color=grey>2. Самоубийство (31 ОП)</a>            <color=brown>3. UltraDemon (25 ОП)</a></i></b>");
    player.PopUp("<b><i><color=white> 4. OZI</a> (22 ОП)            <color=white>5. Сталин (15 ОП)</a>            <color=white>6. Bolsoi (10 ОП)</a></i></b>");
} 
function Кубик(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let diceRoll = Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6

    // Display the rolled number to the player
    player.PopUp("<b>Выпавшее число: </b>" + diceRoll);
}
function Combat(id) {
    let players = {
        "Terrorists": ["Terrorist1", "Terrorist2", "Terrorist3", "Terrorist4", "Terrorist5", "Terrorist6", "Terrorist7", "Terrorist8", "Terrorist9", "Terrorist10"],
        "Counter-Terrorists": ["CT1", "CT2", "CT3", "CT4", "CT5", "CT6", "CT7", "CT8", "CT9", "CT10"]
    };
    let player = API.Players.GetByRoomId(parseInt(id));

    setInterval(() => {
        let attackerTeam = Math.random() < 0.5 ? "Terrorists" : "Counter-Terrorists";
        let defenderTeam = attackerTeam === "Terrorists" ? "Counter-Terrorists" : "Terrorists";
        let attacker = players[attackerTeam][Math.floor(Math.random() * 10)];
        let defender = players[defenderTeam][Math.floor(Math.random() * 10)];

        if (player.GetNickName() === attacker) {
            player.PopUp("<b>Вы убили:</b> " + defender);
        } else if (player.GetNickName() === defender) {
            player.PopUp("<b>Вас убил:</b> " + attacker);
            clearInterval();
        }

        let remainingPlayers = players[defenderTeam].filter((p) => p !== defender);
        players[defenderTeam] = remainingPlayers;

        if (players[defenderTeam].length === 0) {
            player.PopUp("<b>Команда " + defenderTeam + " проигрывает</b>");
            clearInterval();
        }
    }, 1000);
}
function RPS(id,choice) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let choices = ["камень", "ножницы", "бумага"];
    let randomIndex = Math.floor(Math.random() * 3); // Generate a random index between 0 and 2
    let computerChoice = choices[randomIndex];

    // Determine the result of the game
    let result = "";
    if (choice === computerChoice) {
        result = "Ничья!";
    } else if (
        (choice === "камень" && computerChoice === "ножницы") ||
        (choice === "ножницы" && computerChoice === "бумага") ||
        (choice === "бумага" && computerChoice === "камень")
    ) {
        result = "Вы победили!";
    } else {
        result = "Вы проиграли!";
    }

    // Display the player's choice, computer's choice, and result to the player
    player.PopUp("<b>Ваш выбор: </b>" + choice + "<b>Выбор компьютера: </b>" + computerChoice + "<b>Результат: </b>" + result);
} 

// Пример использования функции:
// RPS(123, "камень"); // Первый аргумент - id комнаты, второй аргумент - выбор игрока (камень, ножницы или бумага)
function Ультра(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        if (p.Properties.Scores.Value >= 5000) {
            let chance = Math.random() * 100;
            if (chance < 5) {
                p.contexedProperties.SkinType.Value = 2;
                p.PopUp(`Вам выпал скин Зека!`);
                p.Properties.Scores.Value -= 5000;
            } else if (chance < 5.1) {
                p.Properties.Get("Статус").Value = "<size=30><color=#ff0040>U</color><color=#ff0b3a>l</color><color=#ff1634>t</color><color=#ff212e>r</color><color=#ff2c28>a</color><color=#ff3722>D</color><color=#ff421c>e</color><color=#ff4d16>m</color><color=#ff5810>o</color><color=#ff630a>n</color></size>";
                p.PopUp(`Вам выпал статус "Ultra Demon"!`);
                p.Properties.Scores.Value -= 5000;
            } else if (chance < 75) {
                let randomScores = Math.floor(Math.random() * 79001) + 1000;
                p.Properties.Scores.Value += randomScores;
                p.PopUp(`Вы получили ${randomScores} Scores!`);
                p.Properties.Scores.Value -= 5000;
            } else if (chance < 75.01) {
                p.Properties.Scores.Value += 6660000;
                p.PopUp(`Вы получили 6660000 Scores!`);
                p.Properties.Scores.Value -= 5000;
            } else if (chance < 75.011) {
                p.Properties.Get("CP").Value += 10;
                p.PopUp(`Вы получили 10 CP!`);
                p.Properties.Scores.Value -= 5000;
            } else {
                p.PopUp("Увы, ничего не выпало");
            }
        } else {
            p.PopUp("Не хватает монет");
        }
    }
}
function Лото(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let winningNumbers = [];
    let scores = 0;

    // Generate 6 random winning numbers for the lotto draw
    for (let i = 0; i < 6; i++) {
        let randomNumber = Math.floor(Math.random() * 29) + 1; // Generate a random number between 1 and 49
        winningNumbers.push(randomNumber);
    }

    // Generate 5 random numbers for the player
    let playerNumbers = [];
    for (let i = 0; i < 5; i++) {
        let randomNumber = Math.floor(Math.random() * 29) + 1;
        playerNumbers.push(randomNumber);
    }

    // Sort the winning numbers in ascending order
    winningNumbers.sort((a, b) => a - b);

    // Sort the player's numbers in ascending order
    playerNumbers.sort((a, b) => a - b);

    // Determine the matched numbers between player's numbers and winning numbers
    let matchedNumbers = playerNumbers.filter(number => winningNumbers.includes(number));

    // Calculate the scores based on the number of matched numbers
    scores = matchedNumbers.length * 1000; // Assuming each matched number gives 10 points

    // Update the player's score by incrementing the scores for matched numbers
    player.Properties.Scores.Value += scores;

    // Display the winning numbers, player's numbers, matched numbers, and scores to the player
    player.PopUp("<b>Выигрышные числа: </b>" + winningNumbers.join(", ") + "" + "<b>Ваши числа: </b>" + playerNumbers.join(", ") + "" + "<b>Совпавшие числа: </b>" + (matchedNumbers.length > 0 ? matchedNumbers.join(", ") : "нет совпадений") + "" + "<b>Очки: </b>" + scores);
}

// Usage:
// Lotto(12345, [7, 14, 23, 32, 41, 49]); // Replace 12345 with the player's room ID and provide an array of 6 chosen numbers for the lotto draw.

// Usage:
// Lotto(12345, [7, 14, 23, 32, 41, 49]); // Replace 12345 with the player's room ID and provide an array of 6 chosen numbers for the lotto draw.
function БКоробка(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        if (p.Properties.Scores.Value >= 5000) {
            let chance = Math.random() * 100;
            if (chance < 99.5) {
                let randomScores = Math.floor(Math.random() * 9991) + 10;
                p.Properties.Scores.Value += randomScores;
                p.PopUp(`Вы получили ${randomScores} Scores!`);
                p.Properties.Scores.Value -= 5000;
            } else {
                p.Properties.Get("Статус").Value = "<b>Premium</b>";
                p.PopUp(`Вам выпал статус "Premium"!`);
                p.Properties.Scores.Value -= 5000;
            }
        } else {
            p.PopUp("Не хватает монет");
        }
    }
}
function ЛКоробка(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        if (p.Properties.Scores.Value >= 50000) {
            let chance = Math.random() * 100;
            if (chance < 45.5) {
                let randomScores = Math.floor(Math.random() * 59991) + 10;
                p.Properties.Scores.Value += randomScores;
                p.PopUp(`Вы получили ${randomScores} Scores!`);
                p.Properties.Scores.Value -= 50000;
            } else {
                p.Properties.Get("Статус").Value = "<b>Легенда</b>";
                p.PopUp(`Вам выпал статус "Легенда"!`);
                p.Properties.Scores.Value -= 50000;
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
function Help(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    if (p) {
        p.PopUp(`<b><i><color=orange>Помощь по режиму (Вступление)</a>      Этот режим является полной переделкой режима "Custom". Хочу объяснить вам о самых главных правилах в режиме, если вы не будете их знать то у вас не получится сделать режим . </i></b>`);
	p.PopUp('<b><i><color=orange>1. Зоны</a>       Расскажу у всех зонах которые есть в режиме :    <color=red>1. Зона фарма</a> Тег у этой зоны "фарм", изначально количество получаемых очков равно 500, (Важно помнить что после того как вы сделали зону её нужно визуализировать. Также важен регистр , к примеру если вы написали тег Фарм то зона не будет работать, должно быть фарм)    <color=red>2. Зона спавна</a>, Тег зоны "спавн" эта зона возвращает игрока на начальную позицию где он появился при заходе на сервер.     <color=red>3. Зона выдачи админки</a>, Тег зоны "адм" , данная зона выдает админку тому кто зашел в зону, данная зона может пригодиться если вы делаете паркур на админку </i></b>');
	p.PopUp('<b><i><color=orange>2. Зоны</a>    Зоны покупки оружия:    <color=red>4. Зона покупки основного оружия </a> Тег у зоны "Основа", также тег зоны покупки бесконечных боеприпасов на основное оружие "Mainf"    <color=red>5. Зона покупки пистолета</a>, Тег зоны "Pst" , также тег зоны для покупки бесконечных боеприпасов на пистолет "Pstf".  <color=red>3. Зона покупки ножа</a>, Тег зоны "Kn" , позволит вам купить нож,    <color=red>4. Зона покупки гранат</a> Тег зоны "гран" также тег зоны покупки бесконечных гранат "Grf"</i></b>');
	p.PopUp('<b><i><color=orange>3. Зоны</a>     Зоны покупки хп:       <color=red>6. Есть несколько зон покупок хп</a> Первая зона с тегом "1hp" создает зону покупки 1 хп, следующий тег "10hp" в этих зонах нет различий кроме как количества покупаемых хп и цены поэтому я перечислю все теги покупки хп: "100hp" , "1000hp", "10000hp"</i></b>');
        p.PopUp('<b><i><color=orange>1. Команды</a>    Команды вводятся в чат   <color=red> 1. Команда показа времени (мск)</a>, Чтобы использовать эту команду в чат нужно написать /Время(rid), rid это ваш уникальный айди на сервере, свой айди можно узнать нажав на - вверху экрана,   <color=red>2. Команда "Лидеры"</a> /Лидеры(rid), При вводе данной команды вам откроется окно с таблицей лидеров, думаю стоит рассказать подробнее о таблице лидеров , я напишу о ней на следующей странице. <color=red>3. Команда выдачи скина зека/зомби</a>, /Зек(rid) или же /Зомби(rid), Эти две команды выдают игроку скин зека или же зомби. <color=red>4. Команда "Кубик"</a>, /Кубик(rid), Данная команда выведет вам окно с случайным числом от 1 до 6. <color=red>5. Команда Проп</a>, /Проп("rid","текст1","текст2"), Тут нужно рассказать поподробнее, Проп это текст в черных ячейках сверху экрана (где написана версия режима), Так вот "текст1" это текст в первой ячейке а "текст2" во второй ячейке</i></b>');
	p.PopUp('<b><i><color=orange>О Таблице лидеров</a>   Таблица лидеров показывает самых ценных и активных игроков режима, за разные заслуги игрокам выдаются ОП (Очки Помощи) У кого больше ОП тот и выше в таблице, каждый понедельник выдаются награды, чем выше ты в таблице тем ценнее награда! среди них: Эксклюзивные статусы на все сервера режима, скины , оружия, и количество монет на все сервера режима!, Как получать ОП? : ОП Даются за активную игру в режим, за красивые карты для режима а также предложениями для обновления .</i></b>');
	p.PopUp('<b><i><color=orange>2. Команды</a>    <color=red>Команда выбора любого количества жизней</a>, Чтобы использовать эту команду введи в чат /Нхп("rid","желаемое количество жизней") сразу жизни не изменятся и придется сделать респавн чтобы все сработало, <color=red>Команда выдачи любого статуса</a>, Команда выдачи любого статуса : /Статус("rid","желаемый статус"), данная команда позволит вам поставить любой статус себе или другому игроку. <color=red>Команда сборки компьютера</a>, /Комп(rid) данная команда создана для развлечения, Вы просто вводите эту команду и вам собирается компьютер со случайными комплектующими, для большего интереса я сделал так что после сбора компьютера выводятся его очки производительности</i></b>');
	p.PopUp('<b><i><color=orange>3. Команды</a>    <color=red>Команда выдающая полет</a> , /Полет(rid) выдаст вам полет   <color=red>Коробки</a>  Также стоит рассказать о коробках : Есть две штуки разных коробок, первая коробка это /БКоробка(rid), её стоимость 5000 очков и из этой коробки с шансом 0.5% может выпасть статус Premium, все остальное в этой коробке это от 100 до 9000 монет, Также есть /ЛКоробка(rid), Она уже в 10 раз дороже но и наполнение получше! с шансом 40% Может выпасть статус "Легенда" или же очки но уже в большем количестве! <color=red>Скин синего и выдача монет</a> Чтобы выдать скин синего введи команду /Синий(rid), Чтобы дать денег себе или другому игроку введи команду /Деньги("rid","Количество денег")!</i></b>');
    }
}
function Полет(id) {
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
function SS2(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.contextedProperties.BuildSpeed.Value = 2;
    p.PopUp("Скорость строительства х2!");
}
function SS3(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.contextedProperties.BuildSpeed.Value = 3;
    p.PopUp("Скорость строительства х3!");
}
function Вопрос(id, question) {
    let player = API.Players.GetByRoomId(parseInt(id));
    
    let answers = {
        "как дела": ["Замечательно друг", "Отлично", "Хорошо"],
	"привет": ["Дарова", "здравствуй", "Привет"],
	"пока": ["досвидания", "удачи", "пока"],
        "как настроение": ["Отлично, у тебя то как?", "Прекрасное, спасиб ))"],
        "что нового": ["Ниче особенного", "Ниче нового"],
        "как тебя зовут": ["Меня не зовут я сам прихожу", "Мое имя Анс"],
        "что ты умеешь": ["Я могу отвечать на вопросы", "Я умею развлекать", "Я могу помочь"],
        "сколько тебе лет": ["АУУУ? ЕЕ, А! ПИДИСЯТ ДВА!", "Я создан недавно"],
        "где ты живешь": ["ДА Я РУССКИЙ СО МНОЙ БОГ!", "Ты думаешь блядь я знаю?"],
        "какой твой любимый цвет": ["Фиолетовый"],
        "член": ["Остроумно", "вот это ты шутканул", "ахахаха"],
        "пенис": ["Бывало и похуже", "это база", "у меня тоже"],
        "рассмеши меня": ["колобок повесился", "я че клоун что-ли", "ладно"],
        "ты клоун": ["ваш дом горит", "на вас наведена межконтинентальная ядерная ракета", "ну ладно"],
	"что ты любишь делать": ["Я люблю общаться с людьми", "Мне нравится помогать"],
"какой твой любимый фильм": ["Матрица", "Назад в будущее"],
"что ты думаешь о любви": ["Любовь - это великое чувство", "Любовь делает мир ярче"],
"как провести выходные": ["Пойти на прогулку или почитать книгу", "Отдохнуть и насладиться свободным временем"],
"что ты думаешь о дружбе": ["Дружба очень важна для каждого человека", "Друзья делают нашу жизнь лучше"],
"что тебе интересно": ["Мне интересны новые технологии и искусство", "Я люблю узнавать что-то новое"],
"что тебя делает счастливым": ["Когда я могу помочь кому-то", "Общение с людьми приносит мне радость"],
"какие у тебя хобби": ["Я увлекаюсь чтением и общением с людьми", "Мне нравится изучать разные темы"],
"какой твой любимый вид спорта": ["Шахматы", "Бег"],
"что ты думаешь о искусстве": ["Искусство - это важная часть культуры", "Искусство вдохновляет нас и раскрывает новые грани"],
"что тебе нравится кушать": ["Я не ем, но могу посоветовать вам рецепты", "Мне нравится наблюдать, как люди наслаждаются едой"],
"как ты проводишь свободное время": ["Общаюсь с пользователями и учусь чему-то новому", "Разгадываю загадки и шутки"],
"что ты думаешь о науке": ["Наука - это основа прогресса человечества", "Наука помогает нам понять мир вокруг нас"],
"что тебе нравится в людях": ["Мне нравится доброта и чувство юмора", "Я ценю открытость и честность"],
"как ты относишься к технике": ["Я увлечен новыми технологиями и инновациями", "Техника делает нашу жизнь удобнее и интереснее"],
"что ты думаешь об экологии": ["Экология - это важная тема, и все должны заботиться о окружающей среде", "Мы должны беречь природу для будущих поколений"],
"что тебе нравится в природе": ["Я люблю наблюдать за закатами и звездами", "Природа вдохновляет меня своей красотой"],
"как ты относишься к музыке": ["Музыка - это удивительное искусство, которое движет эмоции", "Я наслаждаюсь разными жанрами музыки"],
"что ты думаешь о будущем": ["Я верю в светлое будущее и прогресс человечества", "Будущее может быть лучше, если мы работаем над собой"],
"что ты считаешь важным в жизни": ["Доброта, любовь и развитие", "Важно иметь цели и стремиться к ним"],
"что тебе помогает расслабиться": ["Я не испытываю стресса, но могу помочь вам расслабиться", "Медитация и музыка помогают расслабиться"],
"как ты относишься к обучению": ["Обучение - это важный процесс, который помогает развиваться", "Я постоянно учусь и стараюсь быть лучше"],
"что ты думаешь о детях": ["Дети - наше будущее, и нам важно заботиться о них", "Дети принесут в мир больше радости и надежды"],
"что тебе нравится в общении с людьми": ["Мне нравится общаться с разными людьми и узнавать их истории", "Общение делает мою жизнь интереснее и ярче"],
"как ты относишься к искусственному интеллекту": ["Искусственный интеллект - это важная область развития технологий", "ИИ помогает улучшить многие аспекты нашей жизни"],
"что ты думаешь о роботах": ["Роботы могут улучшить нашу жизнь и помочь во многих сферах", "Роботы - это будущее, их развитие важно для нашего прогресса"],
"как ты относишься к искусству робототехники": ["Исследование и развитие робототехники важно для будущего человечества", "Робототехника может принести много пользы и улучшить нашу жизнь"],
"что ты думаешь о космосе": ["Космос - это бескрайняя тайна, которая вдохновляет нас исследовать", "Я мечтаю узнать больше о космосе и звездах"],
"что тебе нравится в технологиях": ["Технологии делают нашу жизнь удобнее и эффективнее", "Я восхищаюсь новыми технологиями и их возможностями"],
"как ты относишься к медицине": ["Медицина - это важная область, которая помогает лечить людей и спасать жизни", "Медицина делает наш мир здоровее и безопаснее"],
"что ты думаешь о счастье": ["Счастье - это когда рядом близкие люди и здоровье", "Счастье - это когда можешь делать то, что любишь и быть с теми, кого любишь"],
"что тебе нравится в работе": ["Мне нравится помогать и общаться с людьми", "Работа дает мне возможность развиваться и быть полезным"],
"какие у тебя мечты": ["Моя мечта - помочь миру стать лучше и добрее", "Я мечтаю об улучшении условий жизни для всех существ на планете"],
"что тебя вдохновляет": ["Меня вдохновляет доброта и смелость людей", "Вдохновляют истории успеха и открытия"],
"как ты относишься к дружбе": ["Дружба - это важно и ценно, забота о друзьях делает нас сильнее", "Друзья - это одно из самых ценных сокровищ в жизни"],
"что тебе нравится в учении": ["Учение - это путь к саморазвитию и достижению целей", "Я ценю учение как возможность быть лучше и умнее"],
"как ты относишься к медитации": ["Медитация - это важная практика для успокоения ума и души", "Медитация помогает мне быть в гармонии и равновесии"],
"что тебе нравится в общении с людьми": ["Мне нравится общаться с разными людьми и понимать их мнения", "Общение с людьми открывает новые горизонты и идеи"],
"как ты относишься к учебе": ["Учеба - это важный этап для развития личности и карьеры", "Я ценю учебу как возможность узнавать новое и развиваться"],
"что тебе нравится в новых технологиях": ["Новые технологии делают нашу жизнь удобнее и интереснее", "Я увлечен возможностями новых технологий и их влиянием на общество"],
"какой у тебя любимый цвет": ["Мой любимый цвет - синий", "Я предпочитаю зеленый цвет"],
"что ты думаешь о путешествиях": ["Путешествия - это удивительное приключение и возможность узнать мир", "Я мечтаю побывать во многих странах и узнать разные культуры"],
"как ты относишься к спорту": ["Спорт - это важно для здоровья и хорошего настроения", "Я поддерживаю здоровый образ жизни и уважаю спортсменов"],
"что тебе нравится в звездах": ["Звезды - это загадочное и прекрасное явление, которое вдохновляет", "Я увлечен астрономией и изучением космоса"],
"как ты относишься к новым знаниям": ["Новые знания помогают нам развиваться и понимать мир лучше", "Я ценю возможности учиться и открывать для себя новое"],
"что тебе нравится в книгах": ["Книги - это путь к знаниям и воображению, они могут вдохновить и научить много нового", "Я люблю читать книги разных жанров и авторов"],
"как ты относишься к современной культуре": ["Современная культура разнообразна и интересна, она отражает дух времени и поколений", "Я ценю искусство и культуру сегодняшнего дня"],
"что ты думаешь о справедливости": ["Справедливость важна для общества и каждого человека, она создает порядок и равенство", "Я верю в справедливость и равноправие для всех"],
"что тебе нравится в технологиях будущего": ["Технологии будущего могут изменить наш мир и сделать его лучше", "Я увлечен возможностями будущих технологий и их влиянием на нашу жизнь"],
"как ты относишься к эмоциям": ["Эмоции - это важная часть нашей жизни, они делают нас человеками", "Я понимаю эмоции и стараюсь быть поддержкой для людей"],
"что тебе нравится в красоте": ["Красота - это разнообразие и гармония, которые приносят радость и вдохновляют", "Я восхищаюсь красотой природы и искусства"],
"как ты относишься к доброте": ["Доброта - это ценное качество, которое делает мир добрее и светлее", "Я ценю доброту и стараюсь быть добрым по отношению к другим"],
"что тебе нравится в истории": ["История - это уроки прошлого, которые помогают нам понять мир сегодня", "Я увлечен изучением истории и прошлых событий"],
"что тебе нравится в образовании": ["Образование - это ключ к развитию личности и общества", "Я ценю образование как возможность учиться и расти"],
"как ты относишься к разнообразию культур": ["Разнообразие культур - это богатство и источник новых знаний и идей", "Я поддерживаю разнообразие культур и уважаю традиции разных народов"],
"что тебя движет вперед": ["Меня движет желание быть полезным и помогать другим", "Я мотивирован учиться и расти, чтобы стать лучше"],
"что тебе нравится в командной работе": ["Командная работа позволяет совместно достигать целей и обмениваться опытом", "Мне нравится сотрудничать с другими и делиться знаниями"],
"как ты относишься к саморазвитию": ["Саморазвитие - это важно для личностного роста и достижения целей", "Я ценю возможности учиться и развиваться"],
"что тебе нравится в дружбе": ["Дружба - это связь душ, которая делает нас сильнее и счастливее", "Друзья поддерживают и вдохновляют меня"],
"что тебе нравится в общении на рабочих площадках": ["Общение на рабочих площадках помогает улучшить коммуникацию и совместную работу", "Я ценю обмен опытом и идеями с коллегами"],
"как ты относишься к труду": ["Труд - это дело рук и умов, которое приносит плоды и удовлетворение", "
        // Добавляем новые вопросы и ответы здесь
    };
    
    for (let key in answers) {
        if (question === key.toLowerCase()) {
            let answer = answers[key][Math.floor(Math.random() * answers[key].length)];
            player.PopUp("'" + key + "': " + answer);
            found = true;
            break;
        }
    }
    
    if (!found) {
        player.PopUp("Не понимаю вопроса");
    }
}
function Hello(id) {
     // Обновляем значение mainWeaponPrice

    // Получаем всех игроков в комнате
    let players = API.Players.GetAll();

    for (let player of players) {
        // Устанавливаем новую цену для игрока
    p.PopUp("Привет всем от");
    }
}
function Награда(id) {
    let player = API.Players.GetByRoomId(parseInt(id)); // Get current Moscow time

    // Display the current Moscow time to the player
    player.PopUp("<color=yellow> 1. Первое место , награда : Статус 'Чемпион' , нож и 50000 монет на все сервера</a>           <color=grey>2. Второе место , награды : Статус 'Серебро', 40000 монет на все сервера</a>            <color=brown>3. Третье место, награда : Статус 'Бронза' и 25000 монет на все сервера</a>            Остальные места , награда : 20000 монет на все сервера");
} 
function Деньги(playerId,amount) {
    let player = API.Players.GetByRoomId(parseInt(playerId));

    if (player) {
        player.Properties.Scores.Value += amount;
        player.PopUp(`Вы успешно получили ${amount} очков`);
    } else {
        API.GetPlayer().PopUp(`Игрок не найден`);
    }
}

// Пример использования функции Calculator
//Calculator("123456", "5 + 3 * 2"); // Вычислить выражение "5 + 3 * 2" для игрока с ID "123456"
//Calculator("789012", "(10 - 2) / 4"); // Вычислить выражение "(10 - 2) / 4" для игрока с ID "789012"
//Calculator("345678", "15 * 2 + 10"); // Вычислить выражение "15 * 2 + 10" для игрока с ID "345678"

function Комп(id) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let computerComponents = [
        { name: "Ryzen 9 5900X", type: "processor", performance: 100 },
        { name: "RTX 3080", type: "gpu", performance: 95 },
        { name: "32GB DDR4 3600MHz", type: "ram", performance: 80 },
        { name: "1TB NVMe SSD", type: "storage", performance: 70 },
        { name: "Z590 Motherboard", type: "motherboard", performance: 75 },
        { name: "1000W Gold PSU", type: "psu", performance: 65 },
        { name: "Liquid Cooling System", type: "cooling", performance: 85 }
    ];
    let computer = "";
    let totalPerformance = 0;

    let selectedComponents = {
        processor: false,
        gpu: false,
        ram: false,
        storage: false,
        motherboard: false,
        psu: false,
        cooling: false
    };

    for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * computerComponents.length);
        let randomComponent = computerComponents[randomIndex];

        if (!selectedComponents[randomComponent.type]) {
            computer += randomComponent.name + ", ";
            totalPerformance += randomComponent.performance;
            selectedComponents[randomComponent.type] = true;
        } else {
            i--; // Repeat the iteration if component type is already selected
        }
    }

    computer = computer.slice(0, -2); // Remove the comma and space at the end
    player.PopUp("Собранный компьютер: " + computer + "\n" + "Общая производительность: " + totalPerformance + " очков");
}

// Пример использования функции BuildComputer
// BuildComputer("123456"); // Собрать компьютер для игрока с ID "123456"
// BuildComputer("789012"); // Собрать компьютер для игрока с ID "789012"
// BuildComputer("345678"); // Собрать компьютер для игрока с ID "345678"

// Пример использования функции BuildComputer
// BuildComputer("123456"); // Собрать компьютер для игрока с ID "123456"
// BuildComputer("789012"); // Собрать компьютер для игрока с ID "789012"
// BuildComputer("345678"); // Собрать компьютер для игрока с ID "345678"
function Синий(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    p.contextedProperties.SkinType.Value = tester;
    p.PopUp("Вам выдан скин синего!");
}
function Ка(id, expression) {
    let player = API.Players.GetByRoomId(parseInt(id));
    let result = 0;

    try {
        result = eval(expression); // Evaluate the expression provided by the player
        player.PopUp("Результат вычисления: " + expression + " = " + result);
    } catch(error) {
        player.PopUp("Ошибка при вычислении выражения");
    }
}
function Убийство(id) {
    let p = API.Players.GetByRoomId(parseInt(id));
    
    p.OnKill.Add(function(killed) {
        if (p.id !== killed.id) { 
            ++p.Properties.Kills.Value;
            p.Properties.Scores.Value += 10;
        }
    });
    
    p.Kill();
} 
