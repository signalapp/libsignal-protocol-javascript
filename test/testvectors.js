var TestVectors = function() {
    // We're gonna throw the finalized tests in here:
    var tests = [];

    // The common-case ALICE test vectors themselves...
    var TwoPartyTestVectorsAlice = [
        ["sendMessage",
            {
                smsText: "A",
                ourBaseKey: hexToArrayBuffer('2060fe31b041d28127ac35cbfe790e2a25f92d2e21eb2251690ae75e732f5c4d'),
                ourEphemeralKey: hexToArrayBuffer('082e6391deb7154bd0375df3fc07f87020a3b0fd7a8c6c90e73f0e054bc2bf5d'),
                ourIdentityKey: hexToArrayBuffer('d83d8141aad5f1d62d78a1af09ffbe61f2d3458eeb887a047a58a07565d24463'),
                registrationId: 10290,
                getKeys: {identityKey: hexToArrayBuffer('059c2197be51bae703ae2edd26b6ff2b03d589ef4851be33a3f8d923ad86a6b439'),
                        devices: [{
                            deviceId: 1,
                            preKey: {keyId: 4611143, publicKey: hexToArrayBuffer('052cd5004a4c31dd7b89b7fc80cc3e62abcf9cf1af014c93ec4589f7ca3e79e65c')},
                            signedPreKey: {keyId: 14983230, publicKey: hexToArrayBuffer('05a9ecf666ec55fc27988ecc417db0d62dd5e1fa751da1f7a2dd2eca0d14c8bd46'), signature: hexToArrayBuffer('0b46fdb238f1e2df7b28a94ba575e58b0aa1d377bb843602cc8c2a7cd33770fdd741f65a240f7c3086f00f31dc4f3b8ceeab498356f8d5e4bfe6f2dd3eeca98f')},
                            registrationId: 0xd00d
                        }]
                    },
                expectedCiphertext: hexToArrayBuffer('3308c7b899021221058a49fa8a94224aaa8f5873404e01710ff9ef02169a75f90af4fbbc600796e0521a21050a6cf5e075c9970f14862db8a703a6c761f50b5182d17874908940556a22372222d301330a2105883ab58b3eb6db93b32bf91899a5b5175e7b21e96fff2cec02c83dff16ba1b271000180022a0013c5d070d1b75c418cef769bd7378a58969537a00e0ff60cbb99defb486fcfb43384264da4ea9821c1336f02d988da38944453331c4b30181704cbcec5a792ab87c5ccff256e0b4d61ba6a30a6964783875018882e66bfbd9445ac44fee9dc67edc2ad9de78adbe0eb7e9cb990272183ce5fac682ee5106f67d732cd16dfb731239590ba67dc827e849c49a9fb5ed8eed41d85d5e6de3294e74f3524c6489c2f25482ff52f9ea29c928b25030bec09207'),
            }],
        ["sendMessage",
            {
                smsText: "B",
                expectedCiphertext: hexToArrayBuffer('3308c7b899021221058a49fa8a94224aaa8f5873404e01710ff9ef02169a75f90af4fbbc600796e0521a21050a6cf5e075c9970f14862db8a703a6c761f50b5182d17874908940556a22372222d301330a2105883ab58b3eb6db93b32bf91899a5b5175e7b21e96fff2cec02c83dff16ba1b271001180022a001256aae85babf8c0808f75e08bf10a63f7f3aea97324c2583d777f609df493d7d45232c8883c3e1118fbc29b6318a3091ae57fed4f1c54458c6bb832fbb35f24933cb79765d00f4a161e2877a5a21a26592cdb0aa8a2f70f5fbe8c601ecdff0bef1b733d7fd0cb7b7d8fc1e45f79c016c8f90449239ca1a04b374538f2760eef43127ddc9a6439c6ceca5faf5962fb26d7248257d4d5ee3fe4cf8795acc555718558e5317f618828328b25030bec09207'),
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a2105bc81f1348a1d065b2bd2776edb9f29bc4150399db35c1d87dc258b94894bc57a1000180022a001c93af1107634d9eaa1516a4f8e95c6a454c27313b38830709eb863608f08f2f3a598ff8f558645427f7b6ea8e182e40f7b4a92ce0325f2e22f76f36f6954f6f391dd21d2cad12e5b620e75b991e69df8821ab0e826e3cb2ae1c7a1fb8ed72213e36fc508ca1f0a92ebe2089535b5d5e1b34eae5f91497bd072de47de3291ba78a6fd67d3f8f3f20d04ab3a1159df8f36ef7e4696847e32ce6be07edb93763a2226c87feff8cc4827'),
                type: 1,
                newEphemeralKey: hexToArrayBuffer('d04f334799ea1272eff64c5267e28274f54b91b3b11372879303eb7a8cd52763'),
                expectedSmsText: "C",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a2105bc81f1348a1d065b2bd2776edb9f29bc4150399db35c1d87dc258b94894bc57a1001180022a001eb52c72c7bb6b8878c96398cc05810382d29fc17644f88bdc8d57509e8a734626620ae243cb740466806ee3c64bbf12957d5ac0452a17aba6c0e10e2a82626a986df0c4e5cadebb9ce824f1af4fac85cf7d1b9b7cf37f5df06d77b901d0e2aaa772b49f838ec92a67d13b4d7908cf91f7e0a54ad031b2aa4a954180b652f0696350e4f286592e24cc83091b196f2d48397241e33acaf6f65be27af12f1a8af91fd1daf2c01bdfaaa'),
                type: 1,
                expectedSmsText: "D",
            }],
        ["sendMessage",
            {
                smsText: "E",
                expectedCiphertext: hexToArrayBuffer('330a2105576f3c29717db75ffd19a37154d4d6beba8d796a26c4244793132f7e6cb180491000180122a001bd139a95021d34d9df74d99aa897981aa6718fd6b72d8567891afff92c6e3534ded0de80be7e7c58730a001f2acc1f1e6447f9ca0a99681f3f65d9a4072f3a1fb978740918d3db5c346170edb3bf8fec2b52362edf7138f93cb23a3f17b0f40bf9769e01273955b14c20b6212cbb1f665d1a7e5e770437a53b1727c13bcd639bf5beba71893b8de435244acddc42c3ba592b7debdacdc4dea12dc7e4e670753419be0455e0043f91'),
            }],
        ];
    // Now change the order and make 2 tests out of them:
    tests[tests.length] = {name: "Standard Signal Protocol Test Vectors as Alice", vectors: TwoPartyTestVectorsAlice};

    tests[tests.length] = function() {
        var test = [];
        test[0] = TwoPartyTestVectorsAlice[0];
        test[1] = TwoPartyTestVectorsAlice[1];

        test[2] = ["receiveMessage", { message: TwoPartyTestVectorsAlice[3][1].message,
                        type: TwoPartyTestVectorsAlice[3][1].type,
                        expectedSmsText: TwoPartyTestVectorsAlice[3][1].expectedSmsText,
                        newEphemeralKey: TwoPartyTestVectorsAlice[2][1].newEphemeralKey }] ;
        test[3] = ["receiveMessage", { message: TwoPartyTestVectorsAlice[2][1].message,
                        type: TwoPartyTestVectorsAlice[2][1].type,
                        expectedSmsText: TwoPartyTestVectorsAlice[2][1].expectedSmsText }];

        test[4] = TwoPartyTestVectorsAlice[4];
        return {name: "Shuffled Signal Protocol Test Vectors as Alice", vectors: test};
    }();

    // The common-case BOB test vectors themselves...
    var TwoPartyTestVectorsBob = [
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308c7b899021221058a49fa8a94224aaa8f5873404e01710ff9ef02169a75f90af4fbbc600796e0521a21050a6cf5e075c9970f14862db8a703a6c761f50b5182d17874908940556a22372222d301330a2105883ab58b3eb6db93b32bf91899a5b5175e7b21e96fff2cec02c83dff16ba1b271000180022a0013c5d070d1b75c418cef769bd7378a58969537a00e0ff60cbb99defb486fcfb43384264da4ea9821c1336f02d988da38944453331c4b30181704cbcec5a792ab87c5ccff256e0b4d61ba6a30a6964783875018882e66bfbd9445ac44fee9dc67edc2ad9de78adbe0eb7e9cb990272183ce5fac682ee5106f67d732cd16dfb731239590ba67dc827e849c49a9fb5ed8eed41d85d5e6de3294e74f3524c6489c2f25482ff52f9ea29c928b25030bec09207'),
                type: 3,
                ourPreKey: hexToArrayBuffer('88d9a12e7b03afdac42e49ec9d4e5488e1b1e6d48c6eef6029e45dec09a9d562'),
                preKeyId: 4611143,
                ourSignedPreKey: hexToArrayBuffer('888b3f14aff80e36bb2d2cc26a72da2e1a99330962f5066c7c1dded1262ca665'),
                signedPreKeyId: 14983230,
                ourIdentityKey: hexToArrayBuffer('58c9fb2ec2c6b13e279e7db57ce837c02aac1531504f71130d167cc8fb25a857'),
                newEphemeralKey: hexToArrayBuffer('f0b66ac79b6f4ae997636bc8ed622a184dbe00603b2c657ac18800122523d142'),
                expectedSmsText: "A",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308c7b899021221058a49fa8a94224aaa8f5873404e01710ff9ef02169a75f90af4fbbc600796e0521a21050a6cf5e075c9970f14862db8a703a6c761f50b5182d17874908940556a22372222d301330a2105883ab58b3eb6db93b32bf91899a5b5175e7b21e96fff2cec02c83dff16ba1b271001180022a001256aae85babf8c0808f75e08bf10a63f7f3aea97324c2583d777f609df493d7d45232c8883c3e1118fbc29b6318a3091ae57fed4f1c54458c6bb832fbb35f24933cb79765d00f4a161e2877a5a21a26592cdb0aa8a2f70f5fbe8c601ecdff0bef1b733d7fd0cb7b7d8fc1e45f79c016c8f90449239ca1a04b374538f2760eef43127ddc9a6439c6ceca5faf5962fb26d7248257d4d5ee3fe4cf8795acc555718558e5317f618828328b25030bec09207'),
                type: 3,
                expectedSmsText: "B",
            }],
        ["sendMessage",
            {
                smsText: "C",
                expectedCiphertext: hexToArrayBuffer('330a2105bc81f1348a1d065b2bd2776edb9f29bc4150399db35c1d87dc258b94894bc57a1000180022a001c93af1107634d9eaa1516a4f8e95c6a454c27313b38830709eb863608f08f2f3a598ff8f558645427f7b6ea8e182e40f7b4a92ce0325f2e22f76f36f6954f6f391dd21d2cad12e5b620e75b991e69df8821ab0e826e3cb2ae1c7a1fb8ed72213e36fc508ca1f0a92ebe2089535b5d5e1b34eae5f91497bd072de47de3291ba78a6fd67d3f8f3f20d04ab3a1159df8f36ef7e4696847e32ce6be07edb93763a2226c87feff8cc4827'),
            }],
        ["sendMessage",
            {
                smsText: "D",
                expectedCiphertext: hexToArrayBuffer('330a2105bc81f1348a1d065b2bd2776edb9f29bc4150399db35c1d87dc258b94894bc57a1001180022a001eb52c72c7bb6b8878c96398cc05810382d29fc17644f88bdc8d57509e8a734626620ae243cb740466806ee3c64bbf12957d5ac0452a17aba6c0e10e2a82626a986df0c4e5cadebb9ce824f1af4fac85cf7d1b9b7cf37f5df06d77b901d0e2aaa772b49f838ec92a67d13b4d7908cf91f7e0a54ad031b2aa4a954180b652f0696350e4f286592e24cc83091b196f2d48397241e33acaf6f65be27af12f1a8af91fd1daf2c01bdfaaa'),
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a2105576f3c29717db75ffd19a37154d4d6beba8d796a26c4244793132f7e6cb180491000180122a001bd139a95021d34d9df74d99aa897981aa6718fd6b72d8567891afff92c6e3534ded0de80be7e7c58730a001f2acc1f1e6447f9ca0a99681f3f65d9a4072f3a1fb978740918d3db5c346170edb3bf8fec2b52362edf7138f93cb23a3f17b0f40bf9769e01273955b14c20b6212cbb1f665d1a7e5e770437a53b1727c13bcd639bf5beba71893b8de435244acddc42c3ba592b7debdacdc4dea12dc7e4e670753419be0455e0043f91'),
                type: 1,
                newEphemeralKey: hexToArrayBuffer('98bee5f861b528816888d45c2ca40125b111d2c03e483e57e6886c82dd758467'),
                expectedSmsText: "E",
            }],
        ];

    // Now change the order and make 5 tests out of them:
    tests[tests.length] = {name: "Standard Signal Protocol Test Vectors as Bob", vectors: TwoPartyTestVectorsBob};

    var TwoPartyTestVectorsBobCopy = function() {
        var orig = TwoPartyTestVectorsBob;
        var v = [];
        for (var i = 0; i < TwoPartyTestVectorsBob.length; i++) {
            v[i] = [];
            v[i][0] = orig[i][0];
            v[i][1] = orig[i][1];
        }
        return v;
    }

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = TwoPartyTestVectorsBobCopy();
        var orig = TwoPartyTestVectorsBob;

        // Swap first and second received prekey messages
        v[0][1] = { message: orig[1][1].message, type: orig[1][1].type, expectedSmsText: orig[1][1].expectedSmsText };
        v[0][1].ourPreKey = orig[0][1].ourPreKey;
        v[0][1].preKeyId = orig[0][1].preKeyId;
        v[0][1].ourSignedPreKey = orig[0][1].ourSignedPreKey;
        v[0][1].signedPreKeyId = orig[0][1].signedPreKeyId;
        v[0][1].registrationId = orig[0][1].registrationId;
        v[0][1].ourIdentityKey = orig[0][1].ourIdentityKey;
        v[0][1].newEphemeralKey = orig[0][1].newEphemeralKey;

        v[1][1] = { message: orig[0][1].message, type: orig[0][1].type, expectedSmsText: orig[0][1].expectedSmsText };
        return {name: "Shuffled Signal Protocol Test Vectors as Bob I", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = TwoPartyTestVectorsBobCopy();
        var orig = TwoPartyTestVectorsBob;

        // Swap second received prekey msg with the first send
        v[1] = orig[2];
        v[2] = orig[1];

        return {name: "Shuffled Signal Protocol Test Vectors as Bob II", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = TwoPartyTestVectorsBobCopy();
        var orig = TwoPartyTestVectorsBob;

        // Move second received prekey msg to the end (incl after the first received message in the second chain)
        v[4] = orig[1];
        v[1] = orig[2];
        v[2] = orig[3];
        v[3] = orig[4];

        return {name: "Shuffled Signal Protocol Test Vectors as Bob III", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = TwoPartyTestVectorsBobCopy();
        var orig = TwoPartyTestVectorsBob;

        // Move first received prekey msg to the end (incl after the first received message in the second chain)
        // ... by first swapping first and second received prekey msg
        v[0][1] = { message: orig[1][1].message, type: orig[1][1].type, expectedSmsText: orig[1][1].expectedSmsText };
        v[0][1].ourPreKey = orig[0][1].ourPreKey;
        v[0][1].preKeyId = orig[0][1].preKeyId;
        v[0][1].ourSignedPreKey = orig[0][1].ourSignedPreKey;
        v[0][1].signedPreKeyId = orig[0][1].signedPreKeyId;
        v[0][1].registrationId = orig[0][1].registrationId;
        v[0][1].ourIdentityKey = orig[0][1].ourIdentityKey;
        v[0][1].newEphemeralKey = orig[0][1].newEphemeralKey;

        v[1][1] = { message: orig[0][1].message, type: orig[0][1].type, expectedSmsText: orig[0][1].expectedSmsText };

        // ... then moving the (now-second) message to the end
        v[4] = v[1];
        v[1] = orig[2];
        v[2] = orig[3];
        v[3] = orig[4];

        return {name: "Shuffled Signal Protocol Test Vectors as Bob IV", vectors: v};
    }();

    // Test vectors around an end-session
    var EndSessionTestVectorsBob = [
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1000180022a001a33a6395c75e2754ab5bf45d99c464770fb09d584009be373d965435d7abec5deaafbf63b52010c2d477422da8b4118c4d5055d89232eccbe82c744cfa5bf6ba3562ada59dd60fa111983ec03ea5f02715090071e386001feeac9d22705cb571629e8d2627ca0702ddfcc977b4e8231baea72ea2fb8eb6845fb38479960a44098e09bb2182737dbe4284e8149a36c6ac38dd438875eeeffe7b59bfd760c988385ad5dcf77f1cdad1288c243095b4ff04'),
                type: 3,
                ourPreKey: hexToArrayBuffer('f8ed827e88146a95061863870454eca91e01531762caeeba2e09d107a8987875'),
                preKeyId: 3850073,
                ourSignedPreKey: hexToArrayBuffer('887ebaa951738423384ca0f0d1ebc14dcf196413512b4840ddbe56cbea272a50'),
                signedPreKeyId: 10476053,
                ourIdentityKey: hexToArrayBuffer('d8cb8fcc1c186b7019126a0d07054f9b9a48ed69771c549937b22092dc18b875'),
                newEphemeralKey: hexToArrayBuffer('c89599f0d89eefd371418e9112a41ce43b7eec9e4b7b920c945388d1371e624f'),
                expectedSmsText: "A",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1001180022a0016fb88b9ce5308db84894a6a76626806595c8936c72587d83d0e13a7dae9c97ae62c3796f3c6b00431dec75ec578bfc514fe741ff448562a4f4d6b00a1591c6cb9f4385a05889021d15446b8109ea4ea34e4a2070ae97ddac578d0acbeda55479040f5d9a8e1239802058a574ceae0e9fe7ad57249ba3eb866975508ea05a8f22ad2ca7fcbd4c2508eb4c0c665480cf19c3570dc79f2aedec70a7b0e58eca22484c6be90b44d57ba7288c243095b4ff04'),
                type: 3,
                expectedSmsText: "B",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1002180022a001fc8de7bbe2622120ff8015e2a4af0806fed57092e4ee69f2ff6f93e296178b3ac7c414c2df08d77f8727ce935d5b27d9ad3ed46d61b28d666b651a8b8619cab903996c662b934a77355e70563f3066a9a808a6654a7d10bef7f1736091fad8b8a327d5791889cd8fabf6fd38838dd3350a1f62af7ab9e42ba97c89979831589c4506e6ed847e12a0e1e3004798539daab3065ce2355e4a3f8a93193c394cd42c19334efa98551c13288c243095b4ff04'),
                type: 3,
                expectTerminateSession: true,
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308dafeea011221051511a0c7e3fc2fd58e9fcd72649f2ca4f2efc894272e72b2e300b94b0d642e151a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105814aa31d8ea5d547173dbf78d064157d72af63bf0a3f0afc141f1b020e7a2f481000180022a001d6c78a30985f149cc34ccc3c86aee732d81ec087048e758990fe33e311b614ad225760b3863484089907385775940ad22718f9c124f3f1151a5e357a43ece6b183e2b682e46745ae28a966d93aa5335b5fe37a1b8bfa0bb6b77e168cd0c55bc13f770c322894b4c2efae0f9ddc8aeb0c840a3751e3a02b84d1285168182cbc6963255b85da87ed2fb1826b6e8587a6bb8e5fbb49ae8d2e590f2f4f5c4e46b7be7a5e1b36bdece77e288c243095b4ff04'),
                type: 3,
                ourPreKey: hexToArrayBuffer('d04cad1fd6c9a73b3a6ef89f45941d60f87cefc0efe1fca95befd49494a80673'),
                preKeyId: 3850074,
                ourSignedPreKey: hexToArrayBuffer('887ebaa951738423384ca0f0d1ebc14dcf196413512b4840ddbe56cbea272a50'),
                signedPreKeyId: 10476053,
                ourIdentityKey: hexToArrayBuffer('d8cb8fcc1c186b7019126a0d07054f9b9a48ed69771c549937b22092dc18b875'),
                newEphemeralKey: hexToArrayBuffer('b0c7452e8d971a4c8e032e019f0584876cd2a0ef58029cea034baa625cb04d53'),
                expectedSmsText: "C",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308dafeea011221051511a0c7e3fc2fd58e9fcd72649f2ca4f2efc894272e72b2e300b94b0d642e151a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105814aa31d8ea5d547173dbf78d064157d72af63bf0a3f0afc141f1b020e7a2f481001180022a001daabfa33a904c2da99c91e81552a0e1951313a166f56a7533a57ad6f90938fb852ed0363a38ed21aa6252ed6f0d34264b8865eb0e9000b5c3bddbce025517f74de76e27116fa92d3f79fc65e87fa1503dc13bef6d3d9960e2f2f2cd0d1efe519d9b0409d30b1eeb32bbaf43c6c7abf8dcdd654f605ad838889ee426f244fa5ba054a10b3be5d2337de6ed92ae963a4386ddf462b8943f38bdbbf19aea1a05c0d8b71e50d8abd1804288c243095b4ff04'),
				type: 3,
                expectedSmsText: "D",
            }],
        ["sendMessage",
            {
                smsText: "E",
                expectedCiphertext: hexToArrayBuffer('330a2105d18962fecc5d861aaf89d73ce93e3957d483da4f8306ade163e9ea63f0f308261000180022a0010ca33f1cfa7e617b2e1d1627b7def6e30088547a122322cff2dcb985236509e0de63e865b54758ef373d403c2650d93b5107038efcb9a63d4c8fc4a517f7f897cb6389f2cdf3c0dbc5ee26ee9f4025dccfc3f4423fc9749e669ec13646bc2b6ff7eb9bdb206dff746aa52c269d61077bc7f45c026f77fd64f3ea82ebcd22e7fba0b33b46dda3d1e0a47deb6ef5f0cda82c991c7b372a10248a23254780d5518b1f7c74b6406be7e1'),
            }],
        ];

    // Now shuffle them around and make 6 tests
    tests[tests.length] = {name: "Signal Protocol End Session Test Vectors as Bob", vectors: EndSessionTestVectorsBob};

    var EndSessionTestVectorsBobCopy = function() {
        var orig = EndSessionTestVectorsBob;
        var v = [];
        for (var i = 0; i < EndSessionTestVectorsBob.length; i++) {
            v[i] = [];
            v[i][0] = orig[i][0];
            v[i][1] = orig[i][1];
        }
        return v;
    }

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Swap message 2 and 3, moving 2 after its session close
        var tmp = v[2][1];
        v[2][1] = v[1][1];
        v[1][1] = tmp;

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob I", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Swap message 2 and 4, moving 2 after the new session
        var tmp = v[3][1];
        v[3][1] = v[1][1];
        v[1][1] = tmp;

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob II", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Swap message 3 and 4, starting a new session before closing the last
        var tmp = v[3][1];
        v[3][1] = v[2][1];
        v[2][1] = tmp;

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob III", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Swap message 3 and 4, starting a new session before closing the last
        var tmp = v[3][1];
        v[3][1] = v[2][1];
        v[2][1] = tmp;

        // Swap message 4 and 5, continuing the new session before closing the last
        var tmp = v[4][1];
        v[4][1] = v[3][1];
        v[3][1] = tmp;

        //...and also swap 5 and 6, sending before the last is closed
        tmp = v[4][1];
        v[4] = ["sendMessage", v[5][1]];
        v[5] = ["receiveMessage", tmp];

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob IV", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Put the end session message before all the cooresponding messages
        var tmp = v[0][1];
        v[0][1] = { message: orig[2][1].message, type: orig[2][1].type, expectTerminateSession: orig[2][1].expectTerminateSession };
        v[0][1].ourPreKey = orig[0][1].ourPreKey;
        v[0][1].preKeyId = orig[0][1].preKeyId;
        v[0][1].ourSignedPreKey = orig[0][1].ourSignedPreKey;
        v[0][1].signedPreKeyId = orig[0][1].signedPreKeyId;
        v[0][1].registrationId = orig[0][1].registrationId;
        v[0][1].ourIdentityKey = orig[0][1].ourIdentityKey;
        v[0][1].newEphemeralKey = orig[0][1].newEphemeralKey;
        v[2][1] = { message: tmp.message, type: tmp.type, expectedSmsText: tmp.expectedSmsText };

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob V", vectors: v};
    }();

    tests[tests.length] = function() {
        // Copy TwoPartyTestVectorsBob into v
        var v = EndSessionTestVectorsBobCopy();
        var orig = EndSessionTestVectorsBob;

        // Put the end session message before all the cooresponding messages
        var tmp = v[0][1];
        v[0][1] = { message: orig[2][1].message, type: orig[2][1].type, expectTerminateSession: orig[2][1].expectTerminateSession };
        v[0][1].ourPreKey = orig[0][1].ourPreKey;
        v[0][1].preKeyId = orig[0][1].preKeyId;
        v[0][1].ourSignedPreKey = orig[0][1].ourSignedPreKey;
        v[0][1].signedPreKeyId = orig[0][1].signedPreKeyId;
        v[0][1].registrationId = orig[0][1].registrationId;
        v[0][1].ourIdentityKey = orig[0][1].ourIdentityKey;
        v[0][1].newEphemeralKey = orig[0][1].newEphemeralKey;
        v[2][1] = { message: tmp.message, type: tmp.type, expectedSmsText: tmp.expectedSmsText };

        // ... and also open a new session before receiving the pending messages
        tmp = v[3][1];
        v[3][1] = v[2][1];
        v[2][1] = tmp;

        return {name: "Shuffled End Session Signal Protocol Test Vectors as Bob VI", vectors: v};
    }();

    // Nearly same as above except as Alice
    var EndSessionTestVectorsAlice = [
        ["sendMessage",
            {
                smsText: "A",
                ourBaseKey: hexToArrayBuffer('f09e0e39eb96b08d952c0c3f8283260e6de0575ea22e9b52a1c941eb28981b4a'),
                ourEphemeralKey: hexToArrayBuffer('38480c56ce72a9aaae59ec082818c6b79d0eb2454d6e79427d5626e37ca7f057'),
                ourIdentityKey: hexToArrayBuffer('88fd1a1d2d30f85a29504fd12e3012bc5e4bd0e87487103c5eaa02ea69993050'),
                registrationId: 4620,
                getKeys: {identityKey: hexToArrayBuffer('0503086f4fbae45fdfbcc3e9cc39e5851183b89ccc15e9216b9fda5ab5ce2adf35'),
                        devices: [{
                            deviceId: 1,
                            preKey: {keyId: 3850073, publicKey: hexToArrayBuffer('05a92ea682745b5059d9f7b01bdf1793c9aea3098c5ecdfd83eb253b6092245530')},
                            signedPreKey: {keyId: 10476053, publicKey: hexToArrayBuffer('05a7f5ea2bc830f546f03debdf57a9738aa8c65c3c2857240b786458dbfc58fe76'), signature: hexToArrayBuffer('1a43ae36e17fefcb0d05b5618a79fda414ba5ae5ba3c3097a27b761a55810a2f6f1933e09a12e80f274cde4d39a837e3a1180b1c636c173f40190059ea09cc8e')},
                            registrationId: 0xd00d
                        }]
                    },
                expectedCiphertext: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1000180022a001a33a6395c75e2754ab5bf45d99c464770fb09d584009be373d965435d7abec5deaafbf63b52010c2d477422da8b4118c4d5055d89232eccbe82c744cfa5bf6ba3562ada59dd60fa111983ec03ea5f02715090071e386001feeac9d22705cb571629e8d2627ca0702ddfcc977b4e8231baea72ea2fb8eb6845fb38479960a44098e09bb2182737dbe4284e8149a36c6ac38dd438875eeeffe7b59bfd760c988385ad5dcf77f1cdad1288c243095b4ff04'),
            }],
        ["sendMessage",
            {
                smsText: "B",
                expectedCiphertext: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1001180022a0016fb88b9ce5308db84894a6a76626806595c8936c72587d83d0e13a7dae9c97ae62c3796f3c6b00431dec75ec578bfc514fe741ff448562a4f4d6b00a1591c6cb9f4385a05889021d15446b8109ea4ea34e4a2070ae97ddac578d0acbeda55479040f5d9a8e1239802058a574ceae0e9fe7ad57249ba3eb866975508ea05a8f22ad2ca7fcbd4c2508eb4c0c665480cf19c3570dc79f2aedec70a7b0e58eca22484c6be90b44d57ba7288c243095b4ff04'),
            }],
        ["sendMessage",
            {
                endSession: true,
                expectedCiphertext: hexToArrayBuffer('3308d9feea0112210594b31fff73bbbed5975e98779715700b5fc0293fbeb0901895274ca0ef07a8481a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105cb8e40652635bbd5859c8d592d80a93e2b72bc5691966ce58ecfc9478849976e1002180022a001fc8de7bbe2622120ff8015e2a4af0806fed57092e4ee69f2ff6f93e296178b3ac7c414c2df08d77f8727ce935d5b27d9ad3ed46d61b28d666b651a8b8619cab903996c662b934a77355e70563f3066a9a808a6654a7d10bef7f1736091fad8b8a327d5791889cd8fabf6fd38838dd3350a1f62af7ab9e42ba97c89979831589c4506e6ed847e12a0e1e3004798539daab3065ce2355e4a3f8a93193c394cd42c19334efa98551c13288c243095b4ff04'),
            }],
        ["sendMessage",
            {
                smsText: "C",
                ourBaseKey: hexToArrayBuffer('20174d12685909b9bf1e83ce8edecab2858a2d50cb5b08d163fba2b463a1c768'),
                ourEphemeralKey: hexToArrayBuffer('90c06b979a12a0055411ef6d4a7a80e8297aaec037b2fd4f8e8b7a0d3c0aa268'),
                ourIdentityKey: hexToArrayBuffer('88fd1a1d2d30f85a29504fd12e3012bc5e4bd0e87487103c5eaa02ea69993050'),
                registrationId: 4620,
                getKeys: {identityKey: hexToArrayBuffer('0503086f4fbae45fdfbcc3e9cc39e5851183b89ccc15e9216b9fda5ab5ce2adf35'),
                        devices: [{
                            deviceId: 1,
                            preKey: {keyId: 3850074, publicKey: hexToArrayBuffer('05aa4602b00e4ac4979ff2a70e5c18097aa7d4d784febc00a3f889c6e80b8a9e09')},
                            signedPreKey: {keyId: 10476053, publicKey: hexToArrayBuffer('05a7f5ea2bc830f546f03debdf57a9738aa8c65c3c2857240b786458dbfc58fe76'), signature: hexToArrayBuffer('1a43ae36e17fefcb0d05b5618a79fda414ba5ae5ba3c3097a27b761a55810a2f6f1933e09a12e80f274cde4d39a837e3a1180b1c636c173f40190059ea09cc8e')},
                            registrationId: 0xd00d
                        }]
                    },
                expectedCiphertext: hexToArrayBuffer('3308dafeea011221051511a0c7e3fc2fd58e9fcd72649f2ca4f2efc894272e72b2e300b94b0d642e151a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105814aa31d8ea5d547173dbf78d064157d72af63bf0a3f0afc141f1b020e7a2f481000180022a001d6c78a30985f149cc34ccc3c86aee732d81ec087048e758990fe33e311b614ad225760b3863484089907385775940ad22718f9c124f3f1151a5e357a43ece6b183e2b682e46745ae28a966d93aa5335b5fe37a1b8bfa0bb6b77e168cd0c55bc13f770c322894b4c2efae0f9ddc8aeb0c840a3751e3a02b84d1285168182cbc6963255b85da87ed2fb1826b6e8587a6bb8e5fbb49ae8d2e590f2f4f5c4e46b7be7a5e1b36bdece77e288c243095b4ff04'),
            }],
        ["sendMessage",
            {
                smsText: "D",
                expectedCiphertext: hexToArrayBuffer('3308dafeea011221051511a0c7e3fc2fd58e9fcd72649f2ca4f2efc894272e72b2e300b94b0d642e151a21050b2fe13f294b58baeaba8d43521f9dd4df9fb235a8bd860693dbf60e8f48301022d301330a2105814aa31d8ea5d547173dbf78d064157d72af63bf0a3f0afc141f1b020e7a2f481001180022a001daabfa33a904c2da99c91e81552a0e1951313a166f56a7533a57ad6f90938fb852ed0363a38ed21aa6252ed6f0d34264b8865eb0e9000b5c3bddbce025517f74de76e27116fa92d3f79fc65e87fa1503dc13bef6d3d9960e2f2f2cd0d1efe519d9b0409d30b1eeb32bbaf43c6c7abf8dcdd654f605ad838889ee426f244fa5ba054a10b3be5d2337de6ed92ae963a4386ddf462b8943f38bdbbf19aea1a05c0d8b71e50d8abd1804288c243095b4ff04'),
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a2105d18962fecc5d861aaf89d73ce93e3957d483da4f8306ade163e9ea63f0f308261000180022a0010ca33f1cfa7e617b2e1d1627b7def6e30088547a122322cff2dcb985236509e0de63e865b54758ef373d403c2650d93b5107038efcb9a63d4c8fc4a517f7f897cb6389f2cdf3c0dbc5ee26ee9f4025dccfc3f4423fc9749e669ec13646bc2b6ff7eb9bdb206dff746aa52c269d61077bc7f45c026f77fd64f3ea82ebcd22e7fba0b33b46dda3d1e0a47deb6ef5f0cda82c991c7b372a10248a23254780d5518b1f7c74b6406be7e1'),
                type: 1,
                newEphemeralKey: hexToArrayBuffer('58ea057d9f33be4312a5581e223c277363e3b13c6db1920f63dab8fe29073775'),
                expectedSmsText: "E",
            }],
        ];

    tests[tests.length] = {name: "Standard End Session Signal Protocol Test Vectors as Alice", vectors: EndSessionTestVectorsAlice};

    // Nearly same as above except as Alice
    /*var NoPreKeyEndSessionTestVectorsBob = [
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308ffffffff0f1221050a1fe3a769c05c50e8f09747969099d072f4c343b09ceae56543391349b5bc701a21053841429a37322af3f786be4df3dd8cea5403a79f258e254d4738970acbbe633422d301330a2105896760e61f619db748eb761225b49890aa4e5b286ff8d0575a06660158e40d4e1000180022a0010ced8428b53359fcf2f3dbb6f8be97e77309481df1013a86db4bd41aebc94f7c9d0077c81f53b96501caeece31bd8171f25255ebfe774a981f007849aa38da51904c57a1334a5a11d983205c4cb49e9dd7f308678e34734e6eb9a9297cf03abc8bdd1b1a07c9445474136656ac38cf5ddf41606cf511e20c002fd74bf4b1f8cec738c380b8d4dae0afa0ffc7e091ef5382787eb678b2d9c61dd6fa4ec146c8c30aade6666ee4325228ac3930a0b68d01'),
                type: 3,
                //ourPreKey: hexToArrayBuffer(''),
                //preKeyId: -1,
                ourSignedPreKey: hexToArrayBuffer('b1899b87fa3f6e84894cffded76843ef339f41474ec1ccf1a1c068046c18fb61'),
                signedPreKeyId: 2317088,
                ourIdentityKey: hexToArrayBuffer('18a3c6d4e4522e8f224c0b1efffdc1d91e6aced52f9fa18e14b888eec462394b'),
                newEphemeralKey: hexToArrayBuffer('d10237bd4906b68aa3c9105376747a30fb71ef8a2de9f4f5121f4ca458347355'),
                expectedSmsText: "A",
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308ffffffff0f1221050a1fe3a769c05c50e8f09747969099d072f4c343b09ceae56543391349b5bc701a21053841429a37322af3f786be4df3dd8cea5403a79f258e254d4738970acbbe633422d301330a2105896760e61f619db748eb761225b49890aa4e5b286ff8d0575a06660158e40d4e1001180022a0019ac9ba3b905c2a92bef7ece4d3c741cedcd05d15dd848be7fa5034db6de7835414f803b40301cf5b8c144b13582322d81dfbe3cf5db237595d16706b1cf2258bcf75b5ac69174341eb931c65a52130825c1f1f97641a7cc1c90c530e7cde0c09919ceb0ada3ea8d987295884f4d42561d793129035b8d298cab1fcba8f7a0bec75a1fe4a3440d59dd48c18f0372ab6952da75bf7f350d28132900e8c48210795aaf4296255be120428ac3930a0b68d01'),
                type: 3,
                expectedSmsText: "B",
            }],
        ["sendMessage",
            {
                smsText: "C",
                expectedCiphertext: hexToArrayBuffer('330a21051b4f7303e61b8e0f08dca7b31ce01151831d572e31270b3d291214a6e193b27b1000180022a0015b2f37c95192845d947febe6be26ded465f6d98ccef660216d17887dc32d32609ba7a91d3a332539faf483315952c79383fdd5b9768d4b42c665f5c117e2e1f82e10e07a61f63e8318ff687b3e3704336a9ed76565e088706704b680a6931f9adeacb7320c69c043b72db6b3d19646d67be2112be53e782e3b0f4523c6a019f4a693d1ced9d2379763e867ab2d7a03eb222948e1ce86a515d2da519336f7be53bc19af1c68326b3b'),
            }],
        ["sendMessage",
            {
                smsText: "D",
                expectedCiphertext: hexToArrayBuffer('330a21051b4f7303e61b8e0f08dca7b31ce01151831d572e31270b3d291214a6e193b27b1001180022a0016637465b06e81e2bf100cc7ff5dada7c837374b6a51123e6770d7c2ef032436255cdf866487da20de412efa5b99633aa76d833f8542d6d93d21cd2672904783079e4908a126708dfdfb087f48053bc16e3e28e8ac913d55fc25fb59e9bb3f6009a6938aaa86dbb911984d1425f4b4c959e71faeb85a0a017662d5d5a315b341966baf6dc8fa2e9736655d82249741fdcdb93a432346e218b153e5fbef5f064d9e6f6211cb9a6af36'),
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a21056076ed503123ff2662f1c3fce3f0d49084351d0a25fc08d67115a336e8d4be5c1000180122a0012cc6305372c347f141f7690ecc7cf2cc3a47c2c12d3a492e3be7fd6e2723e29e5e858378781d45eb795f32d47f8539987687db4b54e420b06980700b9c5bfe1780445a097c8a47f94080a4e8d88fe12a2c37e04bcb22e23685b7b955391f99ac2da52fbbb25d83269b6584c68de3b61f7f37ffda8c7350a15e798ca59891dd8f62f59afe3544c4a99118edddda322f4aa516536a64dce05e091b125fb06a9c37501e344b993f2a8b'),
                type: 1,
                expectTerminateSession: true,
                newEphemeralKey: hexToArrayBuffer('3131dd7adb8c2eb01e10d6441ede57e499b929354740cea99f6e79fea0eadf58'),
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('330a21056076ed503123ff2662f1c3fce3f0d49084351d0a25fc08d67115a336e8d4be5c1001180122a001f0898aaaaa4f7928793c4c14b16256e5b797e99a55e12b69242ed4086fb5c1f71982b683f2324305ebccb2eaae146ee783b23f8cebb0aa970e209e554b4ae6140ef30f2f0d83b73ca3f74075194574a9c260ad0e1d08df218aa334ead582efa9a8e705ff17a8e22994a4ac91359cadf9b9cf6853eae12a4bd9c5e5bcad4b8ca991005f0699a5960d09244fa2f01e9f0fb50e85f7318556b314358bfd0fbbc8055dc1090c7d214d83'),
                type: 1,
                expectException: true,
            }],
        ["receiveMessage",
            {
                message: hexToArrayBuffer('3308ffffffff0f122105018086d77ab095075239bc2e54a24355114985c8c897b1a56d253d3449ba416b1a21053841429a37322af3f786be4df3dd8cea5403a79f258e254d4738970acbbe633422d301330a2105578d8b0420b0b68fe817772d4dd4f5eea2f786da22f33a109b57adb7ad084c6f1000180022a001cb7303e83ac80b6cd251a93107061aa96ad7bd9b2983a597ba500b0d3402e93af6bcc9304f1ca3a37e9e5a26743ec50dea620c474cec8101a5439cb357c1a4479bb50b33061405fbfddae119edead07ff4fd292f5d6666fc94b8d36cd96ef6fd58fc70d478b182f3cf15a8f1be6a51e560671f901e09fa8b2376462a4cc953751ddc027e15cd0a92f86bb40d3b199b2dab1e0c2e208b104a2594220ff6129f0650ca8aff90c6e06228ac3930a0b68d01'),
                type: 3,
                //ourPreKey: hexToArrayBuffer(''),
                //preKeyId: -1,
                ourSignedPreKey: hexToArrayBuffer('b1899b87fa3f6e84894cffded76843ef339f41474ec1ccf1a1c068046c18fb61'),
                signedPreKeyId: 2317088,
                ourIdentityKey: hexToArrayBuffer('18a3c6d4e4522e8f224c0b1efffdc1d91e6aced52f9fa18e14b888eec462394b'),
                newEphemeralKey: hexToArrayBuffer('c9411ca8636f8462308135ae6aff6ec30338ae2c87808b6ee35ef21530971070'),
                expectedSmsText: "F",
            }],
        ];

    tests[tests.length] = {name: "No-PreKey fake end-session test as Bob", vectors: NoPreKeyEndSessionTestVectorsBob};
*/

    //TODO: GROUPS
    //TODO: Sender changes identity key?

    return tests;
}();
