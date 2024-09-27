var setPrintArea = [
    {
        area: {   
            node: frontPrint,
            name: 'Frente',
            add: [
                {
                    tittle: 'Grade de fotos',
                    image: {
                        position: {
                            height: 2000,
                            width: 2000,
                        },
                        upload: { 
                            type: '',
                            add: [
                                {x: 0, y: 0, width: 1000, height: 1000},
                                {x: 1000, y: 0, width: 1000, height: 1000},
                                {x: 0, y: 1000, width: 1000, height: 1000},
                                {x: 1000, y: 1000, width: 1000, height: 1000},
                            ],
                        },
                        clip: {
                            url: 'assets/Star.svg',
                            rule: 1,
                        }, 
                    },
                    text: {
                        position: {
                            height: 'full',
                            width: 'full',
                        },
                        onInput: {
                            uppercase: true,
                            align: 'center', // Dont work fine w/ multi konva texts'
                            func: (e)=> {
                                 console.log(e.target.node);
                            },
                        },
                        attrs: {
                            noEdit: {
                                fontFamily: 'font name',
                                verticalAlign: '', // top, middle or bottom
                                align: '', // left, center, or right
                                anchors: anchors, // .none, .all, .basic
                                jsColor: [
                                    { attrs: ['stroke'], id: 1 },
                                ],
                            },
                            edit: {
                                text: 'texto', // Can Edit
                                fill: 'hex color', // Can Edit
                                fontSize: 0, // Can Edit
                                letterSpacing: 0, // Can Edit
                                stroke: 'hex color', // Can Edit
                                strokeWidth: 0, // Can Edit
                                shadowBlur: 0, // Can Edit
                                shadowOpacity: 0, // Can Edit
                                shadowColor: 'hex color', // Can Edit
                                shadowOffsetX: 0, // Can Edit
                                shadowOffsetY: 0, // Can Edit
                                moveable: true,  // Can Edit
                            },
                        },
                        add: [ // Add Text Group
                            {x: 0, y: 0},
                        ],
                        textClip: {
                            url: 'font link', 
                            target: ['1-1', '1-2', '1-3'],
                            height: 0.78,
                            rule: 1, // Optinal
                        },
                    },
                },
            ]
        }
    },
];