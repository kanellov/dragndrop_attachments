<?php

/**
 * dragndrop_attachemnts.
 *
 * A plugin to utilize html5 file API to upload attachments compatible with roundcube 0.8.0 and newer versions
 *
 * @version 1.0
 *
 * @author Strimpakos Giorgos email: strimpak.geo@gmail.com
 * @url https://github.com/strimpak/dragndrop_attachments
 *
 *      This program is free software; you can redistribute it and/or modify
 *      it under the terms of the GNU General Public License as published by
 *      the Free Software Foundation; either version 2 of the License, or
 *      (at your option) any later version.
 *
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU General Public License for more details.
 *
 *      You should have received a copy of the GNU General Public License
 *      along with this program; if not, write to the Free Software
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *      MA 02110-1301, USA.
 */
class dragndrop_attachments extends rcube_plugin
{
    public $task = 'mail';

    public function init()
    {
        $rcmail = rcmail::get_instance();
        if ('compose' === $rcmail->action) {
            $this->include_script('dragndrop_attachments.js');
            $this->add_texts('localization/', true);
        }
    }
}
