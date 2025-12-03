@extends('admin.layouts.master')
@section('title', __('taxido::static.chats.chats'))
@section('content')
    <div class="chatting-main-box">
        <div class="container-fluid">
            <div class="row g-md-4 g-3">
                <div class="col-xxl-3 col-xl-4 col-md-5">
                    <div class="left-sidebar-wrapper">
                        <div class="contentbox">
                            <div class="inside">
                                <div class="contentbox-title">
                                    <div class="contentbox-subtitle">
                                        <h3>{{ __('taxido::static.chats.chats') }}</h3>
                                    </div>
                                </div>
                                <div class="advance-options">
                                    <ul class="nav nav-tabs driver-tabs" id="myTab">
                                        <li class="nav-item">
                                            <button class="nav-link active" id="all-tab" data-bs-toggle="tab"
                                                data-bs-target="#all-tab-pane">{{ __('taxido::static.chats.all') }}</button>
                                        </li>
                                        <li class="nav-item">
                                            <button class="nav-link" id="rider-tab" data-bs-toggle="tab"
                                                data-bs-target="#rider-tab-pane">{{ __('taxido::static.chats.rider') }}</button>
                                        </li>
                                        <li class="nav-item">
                                            <button class="nav-link" id="driver-tab" data-bs-toggle="tab"
                                                data-bs-target="#driver-tab-pane">{{ __('taxido::static.chats.driver') }}</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content custom-scrollbar" id="chat-options-tabContent">
                                        <div class="tab-pane fade show active" id="all-tab-pane">
                                            <form class="chat-search-box">
                                                <i class="ri-search-line"></i>
                                                <input type="text" id="chatSearchAll" class="form-control"
                                                    placeholder="{{ __('taxido::static.chats.search_user') }}">
                                            </form>
                                            <ul class="chats-user" id="recentChats">
                                                <li class="chat-item no-data-tab">
                                                    <img src="{{ asset('images/no-user.png') }}" class="img-fluid"
                                                        alt="No chats">
                                                    <p>{{ __('taxido::static.chats.no_chats_found') }}</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="tab-pane fade" id="rider-tab-pane">
                                            <form class="chat-search-box">
                                                <i class="ri-search-line"></i>
                                                <input type="text" id="chatSearchRiders" class="form-control"
                                                    placeholder="{{ __('taxido::static.chats.search_rider') }}">
                                            </form>
                                            <ul class="chats-user" id="riderChats">
                                                @forelse($riders as $rider)
                                                    <li class="chat-item" data-user-id="{{ $rider?->id }}"
                                                        data-user-name="{{ $rider->name }}"
                                                        data-user-image="{{ $rider?->profile_image?->original_url ?? '' }}"
                                                        data-user-role="{{ $rider->role?->name ?? 'Rider' }}">
                                                        <div class="chat-box">
                                                            <div class="active-profile">
                                                                @if ($rider?->profile_image?->original_url)
                                                                    <img class="img-fluid rounded-circle"
                                                                        src="{{ $rider?->profile_image?->original_url }}"
                                                                        alt="user">
                                                                @else
                                                                    <div class="user-round">
                                                                        <h6>{{ strtoupper($rider?->name[0]) }}</h6>
                                                                    </div>
                                                                @endif
                                                                <div data-user-id="{{ $rider?->id }}"></div>
                                                            </div>
                                                            <div class="name-chat">
                                                                <div>
                                                                    <h5 class="receiverName">{{ $rider->name }}</h5>
                                                                    <h6>{{ $rider->role?->name }}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                @empty
                                                    <li class="chat-item no-data-tab">
                                                        <img src="{{ asset('images/no-user.png') }}" alt="No riders">
                                                        <p class="text-muted">
                                                            {{ __('taxido::static.chats.no_riders_found') }}</p>
                                                    </li>
                                                @endforelse
                                            </ul>
                                        </div>
                                        <div class="tab-pane fade" id="driver-tab-pane">
                                            <form class="chat-search-box">
                                                <i class="ri-search-line"></i>
                                                <input type="text" id="chatSearchDrivers" class="form-control"
                                                    placeholder="{{ __('taxido::static.chats.search_driver') }}">
                                            </form>
                                            <ul class="chats-user" id="driverChats">
                                                @forelse($drivers as $driver)
                                                    <li class="chat-item" data-user-id="{{ $driver?->id }}"
                                                        data-user-name="{{ $driver->name }}"
                                                        data-user-image="{{ $driver?->profile_image?->original_url ?? '' }}"
                                                        data-user-role="{{ $driver->role?->name ?? 'Driver' }}">
                                                        <div class="chat-box">
                                                            <div class="active-profile">
                                                                @if ($driver?->profile_image?->original_url)
                                                                    <img class="img-fluid rounded-circle"
                                                                        src="{{ $driver?->profile_image?->original_url }}"
                                                                        alt="user">
                                                                @else
                                                                    <div class="user-round">
                                                                        <h6>{{ strtoupper($driver?->name[0]) }}</h6>
                                                                    </div>
                                                                @endif
                                                                <div data-user-id="{{ $driver?->id }}"></div>
                                                            </div>
                                                            <div class="name-chat">
                                                                <div>
                                                                    <h5>{{ $driver->name }}</h5>
                                                                    <h6>{{ $driver->role?->name }}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                @empty
                                                    <li class="chat-item no-data-tab">
                                                        <img src="{{ asset('images/no-user.png') }}" alt="No drivers">
                                                        <p class="text-muted">
                                                            {{ __('taxido::static.chats.no_driver_found') }}</p>
                                                    </li>
                                                @endforelse
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-9 col-xl-8 col-md-7">
                    <div class="right-sidebar-chat">
                        <div class="contentbox">
                            <div class="inside">
                                <div class="no-data-container" id="noDataContainer">
                                    <div class="d-flex">
                                        <img src="{{ asset('images/no-chat.png') }}" class="img-fluid" alt="No user selected">
                                    </div>
                                </div>
                                <div class="right-sidebar-title">
                                    <div class="common-space">
                                        <div class="chat-time-chat">
                                            <div class="chat-top-box">
                                                <div class="chat-profile">
                                                    <div id="receiverAvatarContainer">
                                                        <img class="img-fluid rounded-circle" id="receiverAvatar"
                                                            src="{{ asset('images/no-user.png') }}" alt="user">
                                                    </div>
                                                    <div id="receiverStatusDot"></div>
                                                </div>
                                                <div>
                                                    <h5 id="receiverName">{{ __('taxido::static.chats.select_a_user') }}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div class="chatting-option">
                                                <a href="javascript:void(0)" id="clearChat" data-bs-toggle="modal"
                                                    data-bs-target="#confirmation">
                                                    <i class="ri-brush-line"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-sidebar-Chats">
                                    <div class="message">
                                        <div class="msger-chat custom-scrollbar" id="messages">
                                            <div id="loading">
                                                <i class="fa fa-spinner fa-spin"></i>
                                                {{ __('taxido::static.chats.load_message') }}
                                            </div>
                                            <div id="noMessages">
                                                {{ __('taxido::static.chats.no_messages_yet') }}
                                            </div>
                                            <div id="error"></div>
                                        </div>
                                        <form class="msger-inputarea">
                                            <div class="position-relative">
                                                <input class="msger-input" type="text" id="message"
                                                    placeholder="{{ __('taxido::static.chats.type_message') }}">
                                                <i class="ri-error-warning-line msger-input-error-icon"></i>
                                                <button class="msger-send-btn" type="button" id="send">
                                                    <i class="ri-send-plane-line"></i>
                                                </button>
                                                <input type="file" id="sendImage" accept="image/*" style="display:none;" multiple>
                                                <button type="button" id="uploadImage" class="gallery">
                                                    <i class="ri-image-line"></i>
                                                </button>

                                                <!-- Add Progress Bar -->
                                                <div id="uploadProgress" class="progress mt-2" style="display:none;">
                                                    <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal fade confirmation-modal" id="confirmation" tabindex="-1" role="dialog"
        aria-labelledby="confirmationLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-start confirmation-data">
                    <div class="main-img">
                        <div class="delete-icon">
                            <i class="ri-question-mark"></i>
                        </div>
                    </div>
                    <h4 class="modal-title">{{ __('taxido::static.chats.confirmation') }}</h4>
                    <p>{{ __('taxido::static.chats.modal') }}</p>
                    <div class="d-flex">
                        <input type="hidden" id="inputType" name="type" value="">
                        <button type="button" class="btn cancel btn-light me-2" data-bs-dismiss="modal">{{ __('taxido::static.chats.no') }}</button>
                        <button type="button" class="btn btn-primary delete delete-btn spinner-btn" id="confirmDelete">{{ __('taxido::static.chats.yes') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/firebase/firebase-app-compat.js') }}"></script>
    <script src="{{ asset('js/firebase/firebase-firestore-compat.js') }}"></script>
    <script src="{{ asset('js/firebase/firebase-storage-compat.js') }}"></script>
    <script>
        $('#uploadImage').on('click', function() {
            $('#sendImage').click();
        });
    </script>
    <script>
        const firebaseConfig = {
            apiKey: "{{ env('FIREBASE_API_KEY') }}",
            authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
            projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
            databaseURL: "{{ env('FIREBASE_DATABASE_URL') }}",
            storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
            messagingSenderId: "{{ env('FIREBASE_MESSAGING_SENDER_ID') }}",
            appId: "{{ env('FIREBASE_APP_ID') }}",
            measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const storage = firebase.storage();

        let unsubscribeMessages = null;
        let currentChatRoomId = null;
        let currentReceiverId = null;

        const myUserId = String("{{ getAdminId() }}");
        const myUserName = "{{ auth()->user()?->name }}";
        const myUserImage = "{{ auth()->user()?->profile_image?->original_url }}";

        let otherUsers = @json($recentChats);
        $(document).ready(function() {
            const savedChatRoomId = localStorage.getItem('currentChatRoomId');
            const savedReceiverId = localStorage.getItem('currentReceiverId');
            if (savedChatRoomId && savedReceiverId) {
                currentChatRoomId = savedChatRoomId;
                currentReceiverId = savedReceiverId;
                const $chatItem = $(`.chat-item[data-user-id="${savedReceiverId}"]`);
                if ($chatItem.length) {
                    $chatItem.click();
                }
            }
            $('#noDataContainer').show();
            loadLatestChatList();
            loadChatNotifications();

            $('#chatSearchAll').on('input', function() {
                filterChatList($(this).val(), 'recentChats');
            });

            $('#chatSearchRiders').on('input', function() {
                filterChatList($(this).val(), 'riderChats');
            });

            $('#chatSearchDrivers').on('input', function() {
                filterChatList($(this).val(), 'driverChats');
            });

            $('#message').on('keypress', function(e) {
                if (e.which === 13) {
                    $('#send').click();
                    return false;
                }
            });

            $('#sendImage').on('change', function(e) {
                const files = e.target.files;
                if (files.length > 0) {
                    sendImage(files);
                }
            });

            setInterval(() => {
                db.collection('users').doc(myUserId).set({
                    lastActive: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }, 30000); // Every 30 seconds
        });

        function formatTime(timestamp) {
            const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function generateChatRoomId(id1, id2) {
            return [String(id1), String(id2)].sort().join('_');
        }

        function renderChatList(snapshot) {
            const chatList = $('#recentChats');
            chatList.empty();
            let chats = [];

            snapshot.forEach((doc) => {
                const chatId = doc.id;
                const chatData = doc.data();
                const participants = chatData.participants.map(p => {
                    if (typeof p === 'object' && p !== null && 'integerValue' in p) {
                        return String(p.integerValue);
                    }
                    return String(p);
                });

                const otherUserId = participants.find(id => id !== myUserId);
                if (!otherUserId) {
                    console.warn(`Skipping chat ${chatId}: No valid other user ID`);
                    return;
                }

                const lastMessage = chatData.lastMessage || {};
                const senderName = lastMessage.senderName || (otherUsers[otherUserId]?.name || 'Unknown');
                const userImage = otherUsers[otherUserId]?.image || '';
                const userRole = otherUsers[otherUserId]?.role?.name || 'Unknown';

                const unreadCount = chatData.unreadCount && chatData.unreadCount[myUserId] ?
                    chatData.unreadCount[myUserId] : 0;

                chats.push({
                    chatId,
                    otherUserId,
                    user: {
                        name: senderName,
                        image: userImage,
                        role: { name: userRole }
                    },
                    lastMessage,
                    unreadCount,
                    timestamp: lastMessage.timestamp ? lastMessage.timestamp.toDate() : new Date(0)
                });
            });

            // Sort chats by unread count first, then by timestamp
            chats.sort((a, b) => {
                if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
                if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
                return b.timestamp - a.timestamp;
            });

            if (chats.length === 0) {
                chatList.append(`
                    <li class="chat-item no-data-tab">
                        <img src="{{ asset('images/no-user.png') }}" class="img-fluid" alt="No chats">
                        <p>No chats found</p>
                    </li>
                `);
                return;
            }

            chats.forEach(({ otherUserId, user, lastMessage, unreadCount }) => {
                if(otherUsers[otherUserId] != undefined) {
                    const chatItem = `
                        <li class="chat-item" data-user-id="${otherUserId}"
                            data-user-name="${user.name}"
                            data-user-image="${user.image}"
                            data-user-role="${user.role.name}">
                            <div class="chat-box">
                                <div class="active-profile">
                                    ${user.image ?
                                        `<img src="${user.image}" class="img-fluid rounded-circle" width="40" height="40" alt="">` :
                                        `<div class="user-round"><h6>${otherUsers[otherUserId]?.name[0].toUpperCase()}</h6></div>`}
                                    <div class="status" data-user-id="${otherUserId}"></div>
                                </div>
                                <div class="name-chat">
                                    <div>
                                        <h5>${otherUsers[otherUserId].name}</h5>
                                        <h6>${lastMessage.message ?
                                            lastMessage.message.substring(0, 30) +
                                            (lastMessage.message.length > 30 ? '...' : '') :
                                            'No messages'}</h6>
                                    </div>
                                    <div class="text-end">
                                        <small>${lastMessage.timestamp ? formatTime(lastMessage.timestamp) : ''}</small>
                                        ${unreadCount > 0 ? `<span class="badge bg-primary unread-badge">${unreadCount}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </li>
                    `;
                    chatList.append(chatItem);
                }
            });
        }

        let unsubscribeChatList = null;

        function loadLatestChatList() {
            if (unsubscribeChatList) unsubscribeChatList();

            unsubscribeChatList = db.collection('chats')
                .where('participants', 'array-contains', myUserId)
                .onSnapshot((snapshot) => {
                    if (currentChatRoomId) {
                        db.collection('chats').doc(currentChatRoomId).set({
                            unreadCount: {
                                [myUserId]: 0
                            }
                        }, { merge: true });
                    }

                    renderChatList(snapshot);
                }, (error) => {
                    console.error('Error loading chats:', error);
                    $('#recentChats').html(`
                        <li class="chat-item no-data-tab">
                            <img src="{{ asset('images/user.png') }}" class="img-fluid" alt="Error">
                            <p>Error loading chats</p>
                        </li>
                    `);
                });
        }

        $(document).on('click', '.chat-item', function(e) {
            e.preventDefault();
            $('.chat-item').removeClass('active');
            $(this).addClass('active');

            const userId = String($(this).data('user-id'));
            const receiverName = $(this).data('user-name');
            const userImage = $(this).data('user-image');
            const userRole = $(this).data('user-role');
            currentChatRoomId = generateChatRoomId(myUserId, userId);
            currentReceiverId = userId;

            if (!otherUsers[userId]) {
                otherUsers[userId] = {
                    name: receiverName,
                    image: userImage,
                    role: {
                        name: userRole
                    }
                };
            }

            localStorage.setItem('currentChatRoomId', currentChatRoomId);
            localStorage.setItem('currentReceiverId', currentReceiverId);

            $('#receiverName').text(otherUsers[currentReceiverId].name);

            $('#receiverAvatarContainer').html(
                userImage ?
                `<img class="img-fluid rounded-circle" id="receiverAvatar" src="${userImage}" alt="user">` :
                `<div class="user-round"><h6>${otherUsers[currentReceiverId]?.name[0].toUpperCase()}</h6></div>`
            );
            $('#noDataContainer').hide();
            $('#messages').empty();
            $('#noMessages').hide();
            $('#loading').show();

            db.collection('chats').doc(currentChatRoomId).set({
                unreadCount: {
                    [myUserId]: 0
                }
            }, { merge: true });

            if (unsubscribeMessages) {
                unsubscribeMessages();
                unsubscribeMessages = null;
            }
            attachMessageListeners(currentChatRoomId, receiverName);
        });

        $('#send').on('click', function() {
            const $messageInput = $('#message');
            const messageText = $messageInput.val().trim();

            if (!messageText && !$('#sendImage').val()) {
                $messageInput.addClass('error');
                return;
            }
            $messageInput.removeClass('error');

            if (!currentChatRoomId) return;

            const receiverName = otherUsers[currentReceiverId].name;
            const receiverId = String(currentReceiverId);
            const userImage = $('.chat-item.active').data('user-image');
            const userRole = $('.chat-item.active').data('user-role');

            if (!otherUsers[receiverId]) {
                otherUsers[receiverId] = {
                    name: receiverName,
                    image: userImage,
                    role: {
                        name: userRole
                    }
                };
            }

            const messageData = {
                senderId: myUserId,
                receiverId: receiverId,
                senderName: myUserName,
                receiverName: receiverName,
                message: messageText || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            db.collection('chats').doc(currentChatRoomId).collection('messages').add(messageData)
                .then(() => {
                    db.collection('chats').doc(currentChatRoomId).set({
                        participants: [myUserId, receiverId],
                        lastMessage: messageData,
                        unreadCount: {
                            [receiverId]: firebase.firestore.FieldValue.increment(1),
                            [myUserId]: 0
                        }
                    }, { merge: true });
                    $messageInput.val('');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                    $('#error').text('Failed to send message').show();
                });
        });

        $('#confirmDelete').on('click', function(e) {
            e.preventDefault();
            if (!currentChatRoomId) {
                $('#confirmation').modal('hide');
                return;
            }

            const chatRef = db.collection('chats').doc(currentChatRoomId);

            chatRef.collection('messages').get()
                .then((messages) => {
                    const batch = db.batch();
                    messages.forEach((msg) => batch.delete(msg.ref));
                    batch.delete(chatRef);
                    return batch.commit();
                })
                .then(() => {
                    $('#messages').empty();
                    $('#receiverName').text('Select a user');
                    $('#receiverAvatarContainer').html(
                        `<img class="img-fluid rounded-circle" id="receiverAvatar" src="{{ asset('images/user.png') }}" alt="user">`
                    );
                    $('#noDataContainer').show();
                    currentChatRoomId = null;
                    currentReceiverId = null;
                    $('.chat-item').removeClass('active');
                    localStorage.removeItem('currentChatRoomId');
                    localStorage.removeItem('currentReceiverId');
                    if (unsubscribeMessages) unsubscribeMessages();
                    $('#confirmation').modal('hide');
                    loadLatestChatList();
                })
                .catch((error) => {
                    console.error('Error clearing chat:', error);
                    $('#error').text('Failed to clear chat').show();
                    $('#confirmation').modal('hide');
                });
        });

        function attachMessageListeners(chatRoomId, receiverName) {
            $('#loading').show();
            unsubscribeMessages = db.collection('chats').doc(chatRoomId).collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    $('#loading').hide();
                    if (snapshot.empty) {
                        $('#noMessages').show();
                        $('#messages').empty();
                    } else {
                        $('#noMessages').hide();
                        snapshot.docChanges().forEach((change) => {
                            const msg = change.doc.data();
                            const messageId = change.doc.id;
                            if (change.type === 'added') appendMessage(messageId, msg);
                            else if (change.type === 'modified') updateMessage(messageId, msg);
                            else if (change.type === 'removed') removeMessage(messageId);
                        });
                    }
                    $('#messages').scrollTop($('#messages')[0].scrollHeight);
                }, (error) => {
                    $('#loading').hide();
                    $('#error').text('Error loading messages').show();
                    console.error('Error in message listener:', error);
                });
        }

        function appendMessage(messageId, msg) {
            const isMe = msg.senderId === myUserId;
            const bubbleClass = isMe ? 'admin-reply' : 'user-reply';
            const imageSrc = isMe ? myUserImage : (otherUsers[msg.senderId]?.image || '');
            const profileImageHtml = imageSrc ?
                `<img src="${imageSrc}" class="message-profile img-fluid" alt="">` :
                `<div class="user-round message-profile"><h6>${msg?.senderName ? msg.senderName[0].toUpperCase() : 'G'}</h6></div>`;

            console.log("APPEND MESSAGE", msg);
            let messageContent = '';
            if (msg.images && Array.isArray(msg.images) && msg.images.length > 0) {
                messageContent = msg.images.map(imageUrl =>
                    `<img src="${imageUrl}" class="chat-image img-fluid" alt="Chat image">`
                ).join('');
            } else {
                messageContent = `<p>${msg.message || ''}</p>`;
            }

            const html = `
                <div class="${bubbleClass}" id="msg-${messageId}">
                    ${profileImageHtml}
                    <div class="chatting-box">
                        ${messageContent}
                        <h6 class="timing">${msg.timestamp ? formatTime(msg.timestamp) : 'Sending...'}</h6>
                    </div>
                </div>
            `;
            $('#messages').append(html);
        }

        function updateMessage(messageId, msg) {
             // Add this to debug
            const el = $('#msg-' + messageId);
            if (el.length) {
                const isMe = msg.senderId === myUserId;
                const bubbleClass = isMe ? 'admin-reply' : 'user-reply';
                const imageSrc = isMe ? myUserImage : (otherUsers[msg.senderId]?.image || '');
                const profileImageHtml = imageSrc ?
                    `<img src="${imageSrc}" class="message-profile img-fluid" alt="">` :
                    `<div class="user-round message-profile"><h6>${msg?.senderName ? msg.senderName[0].toUpperCase() : 'G'}</h6></div>`;

                console.log("UPDATE MESSAGE", msg);

                let messageContent = '';
                if (msg.images && Array.isArray(msg.images) && msg.images.length > 0) {
                    messageContent = msg.images.map(imageUrl =>
                        `<img src="${imageUrl}" class="chat-image img-fluid" alt="Chat image">`
                    ).join('');
                } else {
                    messageContent = `<p>${msg.message || ''}</p>`;
                }

                el.html(`
                    <div class="${bubbleClass}" id="msg-${messageId}">
                        ${profileImageHtml}
                        <div class="chatting-box">
                            ${messageContent}
                            <h6 class="timing">${msg.timestamp ? formatTime(msg.timestamp) : 'Sending...'}</h6>
                        </div>
                    </div>
                `);
            }
        }

        function removeMessage(messageId) {
            $('#msg-' + messageId).remove();
        }

        function filterChatList(query, tabId) {
            query = query.toLowerCase();
            const $tab = $(`#${tabId}`);
            const $chatItems = $tab.find('.chat-item').not('.no-data-tab');
            let visibleItems = 0;

            $chatItems.each(function() {
                const name = $(this).data('user-name');
                const isVisible = name && typeof name === 'string' && name.toLowerCase().includes(query);
                $(this).toggle(isVisible);
                if (isVisible) visibleItems++;
            });

            const $noDataElement = $tab.find('.no-data-tab');
            if (visibleItems === 0 && query) {
                if ($noDataElement.length === 0) {
                    $tab.append(`
                        <li class="chat-item no-data-tab">
                            <img src="{{ asset('images/no-user.png') }}" class="img-fluid" alt="No results">
                            <p>No results found</p>
                        </li>
                    `);
                }
            } else {
                $noDataElement.remove();
            }
        }

        function sendImage(files) {
            if (!currentChatRoomId) return;

            const receiverId = String(currentReceiverId);
            const receiverName = otherUsers[currentReceiverId].name;
            const totalFiles = files.length;
            let uploadedFiles = 0;
            const imageUrls = [];

            // Show progress bar
            $('#uploadProgress').show();
            $('#progressBar').css('width', '0%').attr('aria-valuenow', 0).text('0%');

            function uploadNext() {
                if (uploadedFiles >= totalFiles) {
                    // All uploads complete, save to Firestore
                    if (imageUrls.length > 0) {
                        const messageData = {
                            senderId: myUserId,
                            senderName: myUserName,
                            receiverId: receiverId,
                            receiverName: receiverName,
                            images: imageUrls,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        };

                        db.collection('chats').doc(currentChatRoomId).collection('messages').add(messageData)
                            .then(() => {
                                db.collection('chats').doc(currentChatRoomId).set({
                                    participants: [myUserId, receiverId],
                                    lastMessage: messageData,
                                    unreadCount: {
                                        [receiverId]: firebase.firestore.FieldValue.increment(1),
                                        [myUserId]: 0
                                    }
                                }, { merge: true });
                                $('#sendImage').val(''); // Clear input
                                $('#uploadProgress').hide(); // Hide progress bar
                            })
                            .catch((error) => {
                                console.error('Error saving message:', error);
                                $('#uploadProgress').hide();
                            });
                    }
                    return;
                }

                const file = files[uploadedFiles];
                const storageRef = storage.ref(`chatImages/${currentChatRoomId}/${Date.now()}_${file.name}`);
                const uploadTask = storageRef.put(file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Update progress for the current file
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        const overallProgress = ((uploadedFiles + (progress / 100)) / totalFiles) * 100;
                        $('#progressBar').css('width', `${overallProgress}%`).attr('aria-valuenow', overallProgress);
                        $('#progressBar').text(`${Math.round(overallProgress)}%`);
                    },
                    (error) => {
                        console.error('Upload failed:', error);
                        alert(`Upload failed for ${file.name}. Please try again.`);
                        uploadedFiles++; // Move to next file despite failure
                        uploadNext();
                    },
                    () => {
                        // Upload completed for this file
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            imageUrls.push(downloadURL);
                            uploadedFiles++;
                            uploadNext();
                        });
                    }
                );
            }

            // Start the upload process
            uploadNext();
        }

        // Notification Logic
        let totalUnreadCount = 0;
        let chatUnreadCounts = {};

        function updateNotificationBadge() {
            const badge = $('#chat-notification-count');
            if (totalUnreadCount > 0) {
                badge.text(totalUnreadCount).show();
            } else {
                badge.hide();
            }
        }

        function renderNotificationItems(chats) {
            const notificationList = $('#chat-notification-list');
            notificationList.empty();

            if (chats.length === 0) {
                notificationList.append(`
                    <li class="no-notifications">
                        <div class="media">
                            <div class="no-data mt-3">
                                <img src="{{ asset('images/no-user.png') }}" alt="">
                                <h6 class="mt-2">{{ __('taxido::static.chats.no_chats_found') }}</h6>
                            </div>
                        </div>
                    </li>
                `);
                return;
            }

            chats.forEach(chat => {
                const notificationItem = `
                    <li class="notification-item ${chat.unreadCount > 0 ? 'unread' : ''}"
                        data-chat-id="${chat.chatId}"
                        data-user-id="${chat.otherUserId}">
                        <div class="media">
                            <div class="notification-img">
                                ${chat.user.image ?
                                    `<img src="${chat.user.image}" class="img-fluid" alt="">` :
                                    `<div class="user-round small"><h6>${chat.user.name[0].toUpperCase()}</h6></div>`}
                            </div>
                            <div class="media-body">
                                <div>
                                    <h5>${chat.user.name}</h5>
                                    <h6 class="message-preview">${chat.lastMessage.message ?
                                        chat.lastMessage.message.substring(0, 30) +
                                        (chat.lastMessage.message.length > 30 ? '...' : '') : ''}</h6>
                                </div>
                                <div class="text-end">
                                    <small>${formatTime(chat.lastMessage.timestamp)}</small>
                                    ${chat.unreadCount > 0 ? `<span class="badge bg-primary unread-badge">${chat.unreadCount}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </li>
                `;
                notificationList.append(notificationItem);
            });
        }

        function loadChatNotifications() {
            db.collection('chats')
                .where('participants', 'array-contains', myUserId)
                .onSnapshot(snapshot => {
                    const chats = [];
                    totalUnreadCount = 0;
                    chatUnreadCounts = {};

                    snapshot.forEach(doc => {
                        const chatData = doc.data();
                        const participants = chatData.participants.map(p => String(p));
                        const otherUserId = participants.find(id => id !== myUserId);

                        if (!otherUserId) return;

                        const user = otherUsers[otherUserId] || {
                            name: 'Unknown',
                            image: '',
                            role: { name: 'Unknown' }
                        };

                        const unreadCount = chatData.unreadCount && chatData.unreadCount[myUserId] ?
                        chatData.unreadCount[myUserId] : 0;
                        totalUnreadCount += unreadCount;
                        chatUnreadCounts[otherUserId] = unreadCount;

                        chats.push({
                            chatId: doc.id,
                            otherUserId,
                            user,
                            lastMessage: chatData.lastMessage || {},
                            unreadCount,
                            timestamp: chatData.lastMessage?.timestamp?.toDate() || new Date(0)
                        });
                    });

                    chats.sort((a, b) => {
                        if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
                        if (b.unreadCount > 0 && a.unreadCount === 0) return 1;
                        return b.timestamp - a.timestamp;
                    });

                    updateNotificationBadge();
                    renderNotificationItems(chats);
                }, error => {
                    console.error('Error loading notifications:', error);
                });
        }

        function markChatAsRead(chatId, userId) {
            db.collection('chats').doc(chatId).set({
                unreadCount: {
                    [myUserId]: 0
                }
            }, { merge: true });

            if (chatUnreadCounts[userId]) {
                totalUnreadCount -= chatUnreadCounts[userId];
                chatUnreadCounts[userId] = 0;
                updateNotificationBadge();
            }
        }

        $(document).on('click', '.notification-item', function() {
            const userId = $(this).data('user-id');
            const chatId = $(this).data('chat-id');

            markChatAsRead(chatId, userId);
            $(`.chat-item[data-user-id="${userId}"]`).click();
        });
    </script>
@endpush
