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
                            height: 2000,
                            width: 2000,
                        },
                        attrs: {
                            noEdit: {
                                text: '',
                                fontFamily: 'Lucidity',
                                fill: 'transparent',
                                anchors: anchors.none,
                                rotate: false,
                                fontSize: 400,
                                moveable: true,
                                align: 'center',
                                strokeWidth: 25,
                                shadowBlur: 0,
                                stroke: 'blue',
                                shadowColor: 'black',
                                shadowOffset: { x: 0, y: 0 },
                                shadowOpacity: 0,
                            },
                            edit: {

                            },
                        },
                        add: [
                            {x: 1000, y: 0},
                        ],
                        clip: {
                            url: 'assets/Font_Lucidity_Psych.ttf', 
                            target: ['1-2'],
                            height: 322,
                        },
                    },
                },
            ]
        }
    },
];