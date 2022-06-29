#version 150
#extension GL_ARB_explicit_attrib_location : require

#define TASK 00
#define ENABLE_LIGHTING 0
#define ENABLE_BINARY_SEARCH 0


// input 'varyings': can be different for each fragment ----------------------------

in vec3 ray_entry_position;

// input 'uniforms': same for all fragments ----------------------------

uniform mat4 Modelview;

uniform sampler3D volume_texture;
uniform sampler2D transfer_func_texture;

uniform vec3    camera_location;
uniform float   sampling_distance;
uniform float   iso_value;
uniform float   iso_value_2;
uniform vec3    max_bounds;
uniform ivec3   volume_dimensions;

uniform vec3    light_position;
uniform vec3    light_ambient_color;
uniform vec3    light_diffuse_color;
uniform vec3    light_specular_color;
uniform float   light_shininess;

const float light_ambient_reflection_constant = 0.4f;
const float light_diffuse_reflection_constant = 0.8f;
const float light_specular_reflection_constant = 0.8f;

// output: colour of this fragment ----------------------------

layout(location = 0) out vec4 FragColor;

// helper functions ----------------------------


// INPUT: sampling position
// OUTPUT: true if given position is inside the volume, false otherwise
bool inside_volume_bounds(const in vec3 sampling_position)
{
    return (   all(greaterThanEqual(sampling_position, vec3(0.0)))
            && all(lessThanEqual(sampling_position, max_bounds)));
}


// INPUT: sampling position
// OUTPUT: the trilinearly-interpolated data value from the volume at the given position
float sample_data_volume(vec3 in_sampling_pos)
{
    vec3 obj_to_tex = vec3(1.0) / max_bounds;
    return texture(volume_texture, in_sampling_pos * obj_to_tex).r;
}


// INPUT: sampling position in volume space
// OUTPUT: gradient at given sampling position
vec3 calculate_gradient(vec3 in_sampling_pos)
{
    // TODO calculate gradient

    return normalize(vec3((in_sampling_pos - vec3(0.0f,0.0f,1.0f))/(2*(in_sampling_pos.x - 0))));
}

void main()
{
    vec3 ray_direction = normalize(ray_entry_position - camera_location);

    // One step through the volume
    vec3 ray_increment = ray_direction * sampling_distance;
    // current position in volume
    vec3 sampling_pos  = ray_entry_position + ray_increment; // small increment just to be sure we are in the volume
    // Init color of fragment
    vec4 out_col = vec4(0.0, 0.0, 0.0, 0.0);

    // check that we are inside volume
    bool inside_volume = inside_volume_bounds(sampling_pos);
    if (!inside_volume)
        discard;


    // example - average intensity projection
#if TASK == 0 

    vec4  sum_intensity = vec4(0.f);
    float num_samples = 0.f;

    // the traversal loop
    // termination when the sampling position is outside volume boundary
    while (inside_volume) 
    {      
        // sample data value from volume at sampling point
        float data_value = sample_data_volume(sampling_pos);

        // convert data value to an intensity value
        vec4 intensity = vec4(data_value, data_value, data_value, 1.f);

        // accumulate intensity
        sum_intensity += intensity;
        num_samples   += 1.f;

        // increment the ray sampling position
        sampling_pos  += ray_increment;

        // update the loop termination condition
        inside_volume  = inside_volume_bounds(sampling_pos);
    }

    // assign average intensity to output
    if (num_samples > 0.f){
        out_col = sum_intensity / num_samples;
    } else {
        out_col = vec4(0.f);
    }

#endif

    // maximum intensity projection
#if TASK == 12 

    // TODO implement maximum intensity projection
    // sample data value from volume at sampling point
    vec4 max_intensity = vec4(0.f);
    
    while (inside_volume) 
    {      
        float data_value = sample_data_volume(sampling_pos);

        vec4 intensity = vec4(data_value, data_value, data_value, 1.f);

        max_intensity = max(intensity, max_intensity);

        sampling_pos += ray_increment;

        inside_volume = inside_volume_bounds(sampling_pos);
    }

    out_col = max_intensity;
#endif


    // first-hit iso-surface raycasting
#if TASK == 13 
    bool hit = false;
    vec4 color = vec4(.0f);
    // TODO implement first-hit iso-surface ray-casting

    while (inside_volume) {          
        float data_value = sample_data_volume(sampling_pos);

        vec4 intensity = vec4(0.5f, 0.5f, 0.5f, 1.f);

        if((data_value - iso_value) > 0 && !hit){
            hit = true;
            color = intensity;
        }

        sampling_pos += ray_increment;

        inside_volume = inside_volume_bounds(sampling_pos); 
    }

    

#if ENABLE_BINARY_SEARCH
    // TODO implement binary search
    NOT_IMPLEMENTED;
#endif

#if ENABLE_LIGHTING
    // TODO implement shading with phong illumination model
    vec3 ambient = light_ambient_reflection_constant * light_ambient_color;

    vec3 light_direction = normalize(vec3(0, 0, 0)- light_position);
    float attenuation = max(dot(calculate_gradient(sampling_pos), light_direction),0.0);
    vec3 diffuse = light_diffuse_reflection_constant * light_diffuse_color * attenuation;

    vec3 halfway_vector = normalize(light_direction + ray_direction);
    float spec = pow(max(dot(calculate_gradient(sampling_pos),halfway_vector), 0.0), light_shininess);
    vec3 specular = light_specular_color * light_specular_reflection_constant * spec;
    color *= (vec4(ambient,1.0f) + vec4(diffuse,1.0f) + vec4(specular,1.0f));
#endif

    out_col = color;

#endif

    // return the calculated color value
    FragColor = out_col;
}

