newFont('Lucidity', 'assets/Font_Lucidity_Psych.ttf');

var colorMenu = [
    {
        color: '#cb6ce6',
    },
    {
        color: '#0000ff',
    }
];

var iniciar = [
    { 
        node: Camiseta.Frente,
        add: [
            {
                tittle: 'Foto',
                image: {
                    position: {
                        width: 'full',
                        height: 'full',
                    },
                    upload: { 
                        type: 'svg',
                        attrs: {
                            noEdit: {
                                jsColor: [
                                    { attrs: ['fill'], id: 1 },
                                ],
                            },
                            edit: {
                                fill: '#000000',
                            }
                        },
                        add: [
                            {x: 989, y: 647, width: 1529, height: 1529}
                        ],
                    },
                    // clip: {
                    //     url: 'assets/Star.svg',
                    //     rule: 1,
                    // },
                },
            },
            // {
            //     tittle: 'Grade de fotos',
            //     image: {
            //         position: {
            //             x: 0,
            //             y: 0,
            //             height: 2000,
            //             width: 2000,
            //         },
            //         upload: { 
            //             type: '',
            //             attrs: {
            //                 noEdit: {
            //                     jsColor: [
            //                         { attrs: ['imgFill'], id: 2 },
            //                     ],
            //                 },
            //             },
            //             add: [
            //                 {x: 0, y: 0, width: 1000, height: 1000},
            //                 {x: 1000, y: 0, width: 1000, height: 1000},
            //                 {x: 0, y: 1000, width: 1000, height: 1000},
            //                 {x: 1000, y: 1000, width: 1000, height: 1000},
            //             ], 
            //         },
            //     } 
            // },
            {
                image: {
                    position: {
                        width: 'full',
                        height: 'full',
                    },
                    mask: {
                        box: {
                            x: 609,
                            y: 405,
                            width: 2289,
                            height: 2146,
                        },
                        btn: [
                            {
                                url: 'assets/Star-1.svg',
                                clip: {
                                    url: 'assets/mask-1.svg',
                                    target: ['1-1'],
                                    rule: 1,
                                }
                            },
                            {
                                url: 'assets/Star-2.svg',
                                clip: {
                                    url: 'assets/mask-2.svg',
                                    target: ['1-1'],
                                    rule: 1,
                                }
                            },
                        ],
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        },
                    },
                }
            },
            {
                tittle: 'Nome',
                text: {
                    position: {
                        height: 'full',
                        width: 'full',
                    },
                    onInput: {
                        uppercase: true,
                        //align: 'center', 
                        // func: (e)=> {
                        //     console.log(e.target.node);
                        // }, 
                    },
                    attrs: {
                        noEdit: {
                            text: '',
                            fontFamily: 'Lucidity',
                            fill: 'transparent',
                            verticalAlign: 'center',
                            align: 'center',
                            anchors: anchors.none,
                            jsColor: [
                                { attrs: ['stroke'], id: 1 },
                            ],
                        },
                        edit: {
                            text: '',
                            fontSize: 400,
                            letterSpacing: 20,
                            strokeWidth: 100,
                            moveable: true,
                        },
                    },
                    add: [
                        //{x: 0, y: 0},
                        {x: 989, y: 1750, maxWidth: 1529},
                    ],
                    textClip: { // Dont work fine w/ 'wrap: char'
                        url: 'assets/Font_Lucidity_Psych.ttf', 
                        //target: ['1-1', '1-2', '1-3'],
                        target: ['1-1', '1-2', '1-3'],
                        rule: 1,
                        height: 0.78,
                    },
                },
            },
            {

            },
        ],
    },

    {
        node: Camiseta.Costa,
        add: [
                {
                    tittle: 'Foto no coração',
                    image: {
                        position: {
                            y: 0,
                            width: 3425,
                            height: 3297,
                        },
                        upload: { 
                            type: 'svg',
                            attrs: {
                                noEdit: {
                                    jsColor: [
                                        { attrs: ['fill'], id: 2 },
                                    ],
                                }
                            },
                            add: [
                                {width: 3425, height: 3297},
                            ],
                        },
                        clip: {
                            url: 'assets/heart-2.svg',
                        },
                    },
                },
                {
                    image: {
                        position: {
                            y: 0,
                            width: 3425,
                            height: 3297,
                        },
                        mask: {
                            url: 'assets/heart-1.svg',
                            attrs: {
                                jsColor: [
                                    { attrs: ['fill'], id: 2 },
                                ],
                            },
                        },
                    }
                },
                {
                    image: {
                        position: {},
                        image: {
                            url: 'assets/Foto.png',
                            attrs: {
                                x: 0,
                                y: 3000,
                            },
                        },
                    }
                },
        ],
    },
];