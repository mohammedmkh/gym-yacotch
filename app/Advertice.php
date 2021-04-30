<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
/**
 * @property integer $id
 * @property integer $course_id
 * @property string $title
 * @property string $image
 * @property string $url
 * @property boolean $status
 * @property string $created_at
 * @property string $updated_at
 * @property string $deleted_at
 * @property Course $course
 */
class Advertice extends Model
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
    protected $fillable = ['course_id', 'title', 'image', 'url', 'status', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function course()
    {
        return $this->belongsTo('App\Course');
    }
}
