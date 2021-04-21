<?php

namespace App\Models;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $user_first_id
 * @property integer $user_second_id
 * @property integer $course_id
 * @property string $title
 * @property string $subject
 * @property string $detail
 * @property boolean $type
 * @property string $created_at
 * @property string $updated_at
 * @property string $deleted_at
 * @property Course $course
 * @property User $userFirst
 * @property User $userSecond
 */
class Report extends Model
{
    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['user_first_id', 'user_second_id', 'course_id', 'title', 'subject', 'detail', 'type', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userFirst()
    {
        return $this->belongsTo(User::class, 'user_first_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userSecond()
    {
        return $this->belongsTo(User::class, 'user_second_id');
    }
}
