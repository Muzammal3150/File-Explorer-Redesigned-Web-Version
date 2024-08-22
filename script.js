class WindowApp {
    constructor(type, windowBody, width = 500, height = 500) {
        this.type = type
        this.width = width
        this.height = height
        this.windowBody = windowBody
        this.WindowLogo = {
            'Image Viewer': 'https://img.icons8.com/?size=100&id=U2IFMSCuhbpE&format=png&color=000000g',
            'File Viewer': 'https://img.icons8.com/?size=100&id=Ygov9LJC2LzE&format=png&color=000000',
            'PDF Viewer': 'https://img.icons8.com/?size=100&id=nDjYPbVE29Us&format=png&color=000000'

        }
    }
    Initilize() {
        document.querySelector("#window-topnav .app-name").innerHTML = this.type
        document.querySelector("#window-topnav .app-logo").src = this.WindowLogo[this.type]
        document.querySelector("#window-topnav .app-logo").src = this.WindowLogo[this.type]
        document.querySelector(".window").style.display = 'flex'
        if (this.type == 'Image Viewer') {
            document.querySelector(".window-body").innerHTML = `<img src='${this.windowBody}'>`

        } else if (this.type == 'PDF Viewer') {
            document.querySelector(".window-body").innerHTML = `    <object data="${this.windowBody}" type="application/pdf" width="100%" height="500px">
            <p>Unable to display PDF file. <a href="your_file_object.pdf">Download</a> instead.</p>
        </object>`
        }
    }
    close() {

        document.querySelector(".window").style.display = 'none'
    }
}
var FileIcons = {
    'https://img.icons8.com/?size=100&id=nDjYPbVE29Us&format=png&color=000000': ['application/pdf'],
    'https://img.icons8.com/?size=100&id=LKoXsvJgltGD&format=png&color=000000': ['video/mp4', 'video/webm', 'video/ogg'],
    'https://img.icons8.com/?size=100&id=Ygov9LJC2LzE&format=png&color=000000': ['text/plain'],
    'https://img.icons8.com/?size=100&id=U2IFMSCuhbpE&format=png&color=000000': ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
    'https://img.icons8.com/?size=100&id=mXRsZ8Xy4xvM&format=png&color=000000': ['text/html', 'text/css', 'text/javascript']
}
var tempSelectedFile, TreeMainFolder, selectedTab
var FolderSelectUrl, TabList = []
var fileDirTree = {}
class Message {
    constructor(type, HTML, closeBtnVisible = false) {
        this.type = type
        this.innerHTML = HTML
        this.closeBtnVisible = closeBtnVisible
        this.messageWrapper = document.querySelector('.message-wrapper')
        this.messageContent = document.querySelector('.message-content')

    }
    open() {
        this.messageContent.innerHTML = this.innerHTML
        this.messageWrapper.style.display = 'grid'
        this.message = document.querySelector(".message")
        for (let i of this.message.classList) this.message.classList.remove(i)
        this.message.classList.add('message')
        this.message.classList.add(this.type)
    }
    close() {
        this.messageWrapper.style.display = 'none'
    }
}
class Tab {

    constructor(url = Object.keys(fileDirTree)[0]) {
        this.url = url.split('>')
        this.UrlLog = []
        this.UrlLogIndex = this.UrlLog.length
        this.UrlLog.push(this.url)

        this.tabWrapper = document.querySelector('.tabs-wrapper')
        this.tabWrapper.innerHTML += `                    <div class="tab" data-id='${TabList.length}' onclick='SelectTab(this.getAttribute("data-id"))'>
        
        <div class="tab-icon">
            <img src="folder-static.svg" alt="" class="static-folder-icon">
            </div>
            <div class="tab-title">${this.url[this.url.length - 1]}</div>
            <div class="tab-close-btn"><i class="fa-solid fa-xmark"></i></div>
            </div>`
        this.allTabs = this.tabWrapper.querySelectorAll('.tab')
        this.tabElem = this.allTabs[this.allTabs.length - 1]
        PickFile(this.url.join('>'))
        this.DisableBtns()
        document.querySelector('.next-btn').classList.add('disabled-btn')

    }

    changeUrl(e, AddToUrlLog) {
        this.url = e.split('>')
        if (AddToUrlLog != 'abcd') {
            this.UrlLog.push(this.url)
            this.UrlLogIndex = this.UrlLog.length
        }

        this.tabElem.innerHTML = `
            
            <div class="tab-icon">
            <img src="folder-static.svg" alt="" class="static-folder-icon">
            </div>
            <div class="tab-title">${this.url[this.url.length - 1]}</div>
            <div class="tab-close-btn"><i class="fa-solid fa-xmark"></i></div>`
        PickFile(this.url.join('>'))
        this.DisableBtns()

    }

    SelectTab() {
        for (i of document.querySelectorAll('.tab-selected')) i.classList.remove('tab-selected')
        this.tabElem.classList.add('tab-selected')

    }
    GoBack() {

        if (this.UrlLogIndex >= 2) {
            this.UrlLogIndex -= 1;
            selectedTab.changeUrl(selectedTab.UrlLog[selectedTab.UrlLogIndex - 1].join('>'), 'abcd')

            document.querySelectorAll('.selected-folder').forEach((i) => { i.classList.remove('selected-folder') })
            ConvertUrlToFolderInNav(selectedTab.url.join('>')).classList.add('selected-folder')
            document.querySelector('.back-btn').classList.remove('disabled-btn')

        } else {
            document.querySelector('.back-btn').classList.add('disabled-btn')
        }
    }
    GoNext() {
        if (this.UrlLogIndex < this.UrlLog.length) {
            this.UrlLogIndex += 1;
            selectedTab.changeUrl(selectedTab.UrlLog[selectedTab.UrlLogIndex - 1].join('>'), 'abcd')

            document.querySelectorAll('.selected-folder').forEach((i) => { i.classList.remove('selected-folder') })
            ConvertUrlToFolderInNav(selectedTab.url.join('>')).classList.add('selected-folder')

            document.querySelector('.next-btn').classList.remove('disabled-btn')
        } else {
            document.querySelector('.next-btn').classList.add('disabled-btn')
        }
    }
    DisableBtns() {
        if (document.querySelectorAll('.arrow').length == 0) document.querySelector('.parent-btn').classList.add('disabled-btn')
        else document.querySelector('.parent-btn').classList.remove('disabled-btn')

    }

}

const filePick = new Message('info', `<div class='pickfile-illustration'><img src='PickFile.jpg'></div><div class="message-heading">Pick A File</div><div class="message-text">To get started, select a base directory where all your files will reside. Since we can’t directly access your files due to browser restrictions, this base directory will serve as the central hub</div><button class="primary-btn" onclick='PickBaseDir()'>Pick</button>`)

filePick.open()


function StartUpFunc() {
    InterpretTree(fileDirTree[handle.name], handle.name)
    for (i of document.querySelectorAll(".folder .sub-folders")) {
        if (i.innerHTML == '') {
            i.parentNode.querySelector('.collapse-btn').style.display = 'none'
        }
    }
    selectedTab = new Tab()
    TabList.push(selectedTab)
    selectedTab.SelectTab()
}

function FolderToggle(folder) {
    var subFolderWrapper = folder.querySelector('.sub-folders')
    var icon = folder.querySelector('.collapse-btn')
    var folderState = folder.getAttribute('data-state')

    if (folderState == 'collapse' | folderState == null) {
        folder.setAttribute('data-state', 'expand')

        gsap.to(subFolderWrapper, {
            height: 0,
            duration: 0.2
        })
        gsap.to(icon, {
            rotation: 180,
            duration: 0.2
        })

    } else {
        folder.setAttribute('data-state', 'collapse')

        gsap.to(subFolderWrapper, {
            height: 'auto',
            duration: 0.2
        })
        gsap.to(icon, {
            rotation: 0,
            duration: 0.2
        })
    }
}



function FolderSelect(folder) {
    document.querySelectorAll('.selected-folder').forEach((i) => { i.classList.remove('selected-folder') })
    folder.classList.add('selected-folder')
    FolderSelectUrl = []
    folderURL(folder)
    FolderSelectUrl = FolderSelectUrl.reverse()
    selectedTab.changeUrl(FolderSelectUrl.join('>'))
}
function folderURL(folder) {

    if (folder.classList.contains('navigation-links')) { } else {
        if (!folder.classList.contains('sub-folders')) {
            FolderSelectUrl.push(folder.querySelector('.folder-title').innerText)
        }
        folderURL(folder.parentNode)
    }

}


async function PickBaseDir() {
    handle = await window.showDirectoryPicker()
    filePick.close()
    fileDirTree = {}
    fileDirTree[handle.name] = await GetDirTree(handle)
    StartUpFunc()

}

function InterpretTree(file, name) {

    if (file instanceof File) {

    } else {
        var oldTreeMainFolder = TreeMainFolder
        TreeMainFolder = AddFileFolderLink(TreeMainFolder, true, name, 'folder-static.svg')
        for (let i in file) {
            InterpretTree(file[i], i)
        }
        TreeMainFolder = oldTreeMainFolder
    }
}
async function GetDirTree(handle) {
    var DirTree = {}
    for await (let i of handle.values()) {
        if (i.kind == 'file') {
            DirTree[i.name] = await i.getFile()
        } else if (i.kind === "directory") {
            const newHandle = await handle.getDirectoryHandle(i.name, { create: false })
            DirTree[i.name] = await GetDirTree(newHandle)
        }
    }
    return DirTree
}

function AddFileFolderLink(parentFolder, subFoldering = false, LinkName, LinkIcon) {
    if (subFoldering) {
        var subFolder = '<div class ="sub-folders"></div>'
        var collapseBtn = `<div class="collapse-btn" onclick='FolderToggle(this.parentNode.parentNode)'><i class="fa-solid fa-chevron-down"></i></div>`
    } else {
        var subFolder = ''
        var collapseBtn = ''
    }

    if (parentFolder == null) {
        var workingFolder = document.querySelector('.navigation-links')
    } else {
        var workingFolder = parentFolder.querySelector('.sub-folders')

    }

    workingFolder.innerHTML += `                        
    <div class="folder">
    <div class="folder-title">
    <div class="folder-icon" onclick='FolderSelect(this.parentNode.parentNode)'><img src="${LinkIcon}" alt=""></div>
    <p class="folder-name" onclick='FolderSelect(this.parentNode.parentNode)'>${LinkName}</p>
    ${collapseBtn}
    </div>
    ${subFolder}
    </div>`

    return workingFolder.querySelectorAll('.folder')[workingFolder.querySelectorAll('.folder').length - 1]
}



function PickFile(url) {
    url = url.split('>')
    var breadCrumb = document.querySelector(".breadcrumb")
    breadCrumb.innerHTML = ''
    for (let i in url) {
        breadCrumb.innerHTML += `<li onclick=ChangeUrlFromBreadCrumb(${i})> ${url[i]}</li>`
        if (url.length - 1 > i) breadCrumb.innerHTML += `<div class="arrow"><i class="fa-solid fa-chevron-right"></i></div>`

    }
    var innerContent = GetInnerContent(url)
    document.querySelector('.file-grid').innerHTML = ''
    for (let i in innerContent) {
        if (innerContent[i] instanceof File) {
            InterpretFileInWeb(innerContent[i], 'file', url.join('>') + '>' + i)
        } else {
            InterpretFileInWeb([i, url.join('>') + '>' + i], 'folder')
        }
    }
}

function GetInnerContent(url) {
    var directory = fileDirTree
    for (i of url) {
        directory = directory[i]
    }
    return directory
}

function InterpretFileInWeb(i, type, FileUrl) {

    if (type == 'file') {
        document.querySelector('.file-grid').innerHTML += `<div class="file" onclick='TempSelect(this)' ondblclick='ViewFile("${FileUrl}")'>
        <div class="file-thumbnail">
        <img src="${GetFIleIcon(i.type)}" alt="">
        </div>
        <div class="file-title">${i.name}</div>
        </div>`

    } else {

        document.querySelector('.file-grid').innerHTML += `
        <div class="file" ondblclick='SelectSubFolder("${i[0]}")' onclick='TempSelect(this)'>
        <div class="file-thumbnail"><img src="folder-static.svg" alt=""></div>
        <div class="file-title">${i[0]}</div>
        
        </div>`

    }
}

function GetFIleIcon(type) {
    result = ''
    for (i in FileIcons) {
        if (FileIcons[i].indexOf(type) != -1) {
            result = i
            return result
        } else {
            result = 'https://img.icons8.com/?size=100&id=XWoSyGbnshH2&format=png&color=000000'
        }
    }
    return result
}

function SelectSubFolder(e) {
    FolderSelect(ConvertUrlToFolderInNav(selectedTab.url.join('>') + ">" + e))
    selectedTab.UrlLog.pop()
}

function ConvertUrlToFolderInNav(url) {
    url = url.split('>')
    var mainFolder = (CheckFolderInFolder(document.querySelectorAll('.navigation-links>.folder>.folder-title'), url[0]))
    url.shift()
    for (i of url) {
        mainFolder = CheckFolderInFolder(mainFolder.querySelectorAll(':scope>.sub-folders>.folder>.folder-title'), i)
    }
    return mainFolder
}
function CheckFolderInFolder(folder, folderToFind) {
    for (i of folder) {
        if (i.innerText == folderToFind) {
            return i.parentNode
        }
    }
}

function TempSelect(e) {
    for (i of document.querySelectorAll('.selected-file')) i.classList.remove("selected-file")
    e.classList.add('selected-file')
    tempSelectedFile = e
}

function ChangeUrlFromBreadCrumb(e) {
    var breadCrumbUrl = (selectedTab.url.slice(0, e))
    breadCrumbUrl.push(selectedTab.url[e])
    selectedTab.changeUrl(breadCrumbUrl.join('>'))

}


ActionsOnFile = {
    'Go To Parent Directory': () => {
        if (selectedTab.url.length > 1) selectedTab.changeUrl(selectedTab.url.slice(0, selectedTab.url.length - 1).join('>'))
    },
    'Go Back': () => selectedTab.GoBack(),
    'Go Next': () => selectedTab.GoNext(),


}

function PerformAction(action) {
    ActionsOnFile[action]()
}

function AddTab() {
    TabList.push(new Tab())
}
function SelectTab(e) {
    selectedTab = TabList[parseInt(e)]
    selectedTab.allTabs = document.querySelectorAll('.tab')
    selectedTab.tabElem = document.querySelectorAll('.tab')[e]
    selectedTab.SelectTab()
    selectedTab.changeUrl(selectedTab.url.join('>'))
}

function CloseWindow() {
    document.querySelector(".window").style.display = 'none'
}

function DragEnter(topNav, clickEvent) {
    window.onmousemove = (e) => {
        var XCord = (e.x - clickEvent.offsetX)
        var YCord = (e.y - clickEvent.offsetY)
        if (XCord > 0 && XCord < window.innerWidth - topNav.parentNode.getBoundingClientRect().width) topNav.parentNode.style.left = XCord + 'px'
        if (YCord > 0 && YCord < window.innerHeight - topNav.parentNode.getBoundingClientRect().height) topNav.parentNode.style.top = YCord + 'px'
    }
    window.onmouseup = (e) => {
        window.onmousemove = (e) => { }
    }
}

function ViewFile(e) {
    var file = GetFileFromURL(e)
    if (['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].indexOf(file.type) != -1) {
        var ViewApp = new WindowApp('Image Viewer', URL.createObjectURL(file))
        ViewApp.Initilize()
    } else if ('application/pdf' == file.type) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var ViewApp = new WindowApp('PDF Viewer', URL.createObjectURL(file))
            ViewApp.Initilize()
        }
    }
}

function GetFileFromURL(e) {
    e = e.split('>')
    var oldDir = fileDirTree[e[0]]
    e.shift()
    for (i of e) oldDir = (oldDir[i])
    return oldDir
}


