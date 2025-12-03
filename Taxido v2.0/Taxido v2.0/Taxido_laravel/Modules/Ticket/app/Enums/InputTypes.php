<?php

namespace Modules\Ticket\Enums;

enum InputTypes:string {
    
    const INPUT_TYPES = [
        'date', 'text', 'email', 'radio', 'number', 'select', 'textarea', 'checkbox'
    ];

    const REQUIRE_PLACEHOLDERS_IN = [
        'date', 'text', 'email', 'number', 'select', 'textarea'
    ];

}